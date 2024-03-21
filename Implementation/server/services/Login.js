const prisma = require('../prismaClient')
const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')

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

    if (user != null) {
        try {
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' },
            )

            // create the transport channel for emails to be sent through
            const emailTransport = nodemailer.createTransport({
                service: 'gmail',
                secure: true,
                // sender information
                auth: {
                    user: 'mengdevcharger@gmail.com',
                    pass: process.env.EMAIL_APP_PASSWORD, // app password goes here
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
                        link: `http://localhost:3000/api/verify-user?token=${token}`,
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

module.exports = {
    CheckUser,
    Login,
    CreateUser,
}
