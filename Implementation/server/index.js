const express = require('express')
const app = express()
const PORT = 5000

const apiRoute = require('./routes/Api')

app.get('/', (req, res) => {
    res.send('EV Charging Backend :)')
})

app.use('/api', apiRoute)

app.listen(PORT, () => {
    console.log(`Express running on port ${PORT}`)
})
