const nodemailer = require('nodemailer')
const express = require('express')
const app = express()
const PORT = 3000

const apiRoute = require('./routes/Api')
const hbs = require('nodemailer-express-handlebars')

app.get('/', (req, res) => {
    res.send('EV Charging Backend :)')
})

app.use('/api', apiRoute)

// create the transport channel for emails to be sent through
const emailTransport = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    // sender information
    auth: {
        user: 'mengdevcharger@gmail.com',
        pass: '', // app password goes here
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

// route test email page
app.get('/test-email', async (req, res) => {
    try {
        // example email
        const emailOptions = {
            from: 'mengdevcharger@gmail.com',
            to: '', //test email here
            subject: 'testEmail',
            template: 'testEmail',
            context: {
                user: '',
                zone: '',
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
        res.status(500).send('Internal Error')
    }
})

app.listen(PORT, () => {
    console.log('Express running on port ${PORT}')
})
