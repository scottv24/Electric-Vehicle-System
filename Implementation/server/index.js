const express = require('express')
const app = express()
//const PORT = 5000
//local running port, comment out for deployment
const PORT = 3000

// const config = require('/config/config.js')
// const SECRET = 'test'
// const ngrok_url = '<PUT YOUR NGROK HTTP URL HERE>'

// const cors = require('cors')
// const bodyParser = require('body-parser')
// const jwt = require('jsonwebtoken')
// const nodeMailer = require('nodemailer')

const apiRoute = require('./routes/Api')

app.get('/', (req, res) => {
    res.send('EV Charging Backend :)')
})

//app.get('/chargers', )

app.use('/api', apiRoute)

app.listen(PORT, () => {
    console.log('Express running on port ${PORT}')
})
