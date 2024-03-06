const express = require('express')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router()
const jwt = require('jsonwebtoken')
//const { sendLoginLink } = require('./mailer') //Email logic
const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')

//Testing purposes only - DELETE FOR RELEASE
router.get('/get-data', async function (req, res) {
    const accounts = await prisma.users.findMany()
    res.json({ accounts })
})

router.post('/create-user', async function (req, res) {
    const accountToPost = await prisma.users.create({
        data: {
            email: 'am454@hw.ac.uk',
            permissionLevel: 'USER',
            status: 'IDLE',
            pendingStartTime: '2024-03-05T00:02:08.000Z',
            chargePointID: null,
        },
    })
})

router.get('/login', async function (req, res) {
    const user = await prisma.users.findFirst({
        where: {
            email: 'am454@hw.ac.uk',
        },
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
                        link: `http://localhost:3000/api/account/verify-user?token=${token}`,
                    },
                }

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
})

router.get('/verify-user', async function (req, res) {
    const token = req.query.token
    if (token == null) return res.sendStatus(401)

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const user = await prisma.users.findFirst({
            where: {
                id: decodedToken.userId,
            },
        })
        res.send('Authenticated, welcome')
    } catch (error) {
        res.sendStatus(401)
    }
})

// crypto.subtle
//     .generateKey(
//         {
//             name: 'HMAC',
//             hash: { name: 'SHA-256' },
//         },
//         true,
//         ['sign', 'verify'],
//     )
//     .then((key) => {
//         crypto.subtle.exportKey('jwk', key).then((exported) => {
//             console.log(exported.k)
//         })
//     })

module.exports = router
