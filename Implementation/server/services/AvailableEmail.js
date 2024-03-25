const { getPrismaClient } = require('../index')
const prisma = getPrismaClient()
const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')
const { getEmailSecret } = require('../index')

async function SendAvailableEmail(id, location) {
    try {
        const { email } = await prisma.users.findFirst({
            where: { id },
        })
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

        // example email
        const emailOptions = {
            from: 'mengdevcharger@gmail.com',
            to: email, //test email here
            subject: 'Charge Checker - Complete Login',
            template: 'SpaceAvailable',
            context: {
                checkIn: `${process.env.FRONTEND_URL}/queue`,
                directions: `http://maps.apple.com/?q=${location.lat},${location.lng}`,
                location: location.name,
            },
            attachments: [
                {
                    filename: 'GreenEmailLogo.png',
                    path: 'email_templates/GreenEmailLogo.png',
                    cid: 'greenLogo',
                },
                {
                    filename: 'WhiteEmailLogo.png',
                    path: 'email_templates/WhiteEmailLogo.png',
                    cid: 'whiteLogo',
                },
            ],
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
}

module.exports = SendAvailableEmail
