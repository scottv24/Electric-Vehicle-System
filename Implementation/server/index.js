const nodemailer = require('nodemailer')
const express = require('express')
const cors = require('cors')
const app = express()
const cookies = require('cookie-parser')

var PORT = process.env.HOST_PORT

if (PORT == undefined) {
    PORT = 3000
}

// const config = require('/config/config.js')
// const SECRET = 'test'
// const ngrok_url = '<PUT YOUR NGROK HTTP URL HERE>'

// const cors = require('cors')
// const bodyParser = require('body-parser')
// const jwt = require('jsonwebtoken')
// const nodeMailer = require('nodemailer')
app.use(express.json())
app.use(cookies())
app.use(cors({ credentials: true, origin: 'http://localhost:8287' }))

const apiRoute = require('./routes/Api')
const hbs = require('nodemailer-express-handlebars')

app.get('/', (req, res) => {
    console.log(req.cookies)
    res.send('EV Charging Backend :)')
})
app.use(express.json())
app.use('/api', apiRoute)

/**********************************
 *      EMAILING FUNCTIONALITIES
 **********************************/
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

// Function to compose and send an email
function createEmail(recipient, subject, template, context) {
    var emailOptions =  {
        from: 'mengdevcharger@gmail.com',
        to: recipient, //test email here
        subject: subject,
        template: template,
        context: context,
        // all emails have an attachement which is the logo
        attachments: [{
            filename: 'testLogo.png',
            path: __dirname + '/email_templates/testLogo.png',
            cid: 'testLogo' //same cid value as in the html img src
        }]
    }

    // attempt to send the email
    try {
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
}

/**********************************
 *      EMAIL CONTEXTS
 *      Each email only cares about certain information
 *      The following functions sets the information to 
 *      be used in the email
 **********************************/
let testEmailContext = {
    title: "Test Email!"
}
let chargeFinishedContext = (recipient, zone, queueSize) => {
    return {
        title: "Your Vehicle is Fully Charged!",
        user: recipient,
        zone: zone,
        queueSize: queueSize
    }
}
let nextQueueContext = (recipient, zone, queueSize) => {
    return {
        title: "You Are Next in Queue!",
        user: recipient,
        zone: zone,
    }
}
let signInContext = (recipient, zone) => {
    return {
        title: "Thank You For Using",
        user: recipient,
        zone: zone
    }
}

/**********************************
 *      TEST ROUTES FOR EMAIL
 **********************************/
app.get('/test-email', async () => {
    createEmail('', 'test email', 'testEmail', testEmailContext);
})
app.get('/charge-finish-email', async () => {
    createEmail('', 'test email', 'ChargeFinished', chargeFinishedContext('Adam', 'Robotarium', 5));
})
app.get('/next-queue-email', async () => {
    createEmail('', 'test email', 'NextQueue', nextQueueContext('Eve', 'Oriam', 2));
})
app.get('/park-sign-in-email', async () => {
    createEmail('', 'test email', 'ParkingSignIn', signInContext('Mr President', 'Park J'));
})

app.listen(PORT, () => {
    console.log(`Express running on port ${PORT}`)
})