var fs = require('fs')
const { PrismaClient } = require('@prisma/client')

var prisma = new PrismaClient();

if(process.env.PRODUCTION == "TRUE")
{
    fs.readFile("/run/secrets/db-url", 'utf8', function(err, data) {
        if (err) 
        {
            console.log("Cannot find database connection URL. Is it set as a Docker secret correctly?");

            throw err;
        }

        prisma = new PrismaClient({
            datasources: {
            db: {
                    url: data,
                },
            },
        });
    });
}
else
{
    prisma = new PrismaClient();
}
const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')

const {getJWTSecret, getEmailSecret} = require('../index')

async function CheckUser(email) {
    const user = await prisma.users.findFirst({
        where: { email },
    })
    return user
}

async function Login(req, res) {
    const user = await prisma.users.findFirst({
        where: { email: req.body.email },
    })
    
    const location = req.body.location
    let redirect = ''
    if (location) {
        redirect = `&location=${location}`
    }
    if (user != null) {
        try {
            console.log("'" + await getJWTSecret() + "'")
            const jwtSecret = await getJWTSecret()
            const token = jwt.sign(
                { userId: user.id },
                jwtSecret,
                { expiresIn: '1h' },
            )
            // create the transport channel for emails to be sent through
            const emailTransport = nodemailer.createTransport({
                service: 'gmail',
                secure: true,
                // sender information
                auth: {
                    user: 'mengdevcharger@gmail.com',
                    pass: await getEmailSecret(), // app password goes here
                },
            })

            // Configure the email transporter to use the email templates
            emailTransport.use(
                'compile',
                hbs({
                    viewEngine: {
                        extname: '.handlebars',
                        layoutsDir: 'email_templates/',
                        defaultLayout: false,
                        partialsDir: 'email_templates',
                    },
                    viewPath: 'email_templates',
                    extName: '.handlebars',
                }),
            )
            try {
                // example email
                const emailOptions = {
                    from: 'mengdevcharger@gmail.com',
                    to: user.email, //test email here
                    subject: 'loginEmail',
                    template: 'loginEmail',
                    context: {
                        user: user.email,
                        link: `${process.env.HOST_NAME}/api/verify-user?token=${token}${redirect}`,
                    },
                }
                console.log('Sending email...')
                emailTransport.sendMail(emailOptions, (err, res) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('Email Sent: ' + res.response)
                    }
                })
            } catch (err) {
                console.error('Error: ', err)
                //res.status(500).send('Internal Error')
            }

            //await sendLoginLink({ email: user, token })
        } catch (error) {
            return res.send('Error logging in, please try again')
        }
    }
    res.send('Check your email to finish logging in')
    //res.send(user.email)
}

async function CreateUser(email) {
    const accountToPost = await prisma.users.create({
        data: { email },
    })
}

async function getUserID(req) {
    try {
        const { token } = req.cookies
        const decodedToken = jwt.verify(token, await getJWTSecret())
        return +decodedToken.userId
    } catch (err) {
        return null
    }
}

module.exports = {
    CheckUser,
    Login,
    CreateUser,
    getUserID,
}
