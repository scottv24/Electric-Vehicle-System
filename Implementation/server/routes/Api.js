const express = require('express')
const router = express.Router()
const { verifyLogin } = require('../middleware/verifyLogin')
const { CheckUser, Login, CreateUser } = require('../services/Login')
const jwt = require('jsonwebtoken')

const { getJWTSecret, getPrismaClient } = require('../index')

const prisma = getPrismaClient()

// Import nested routes
const chargerRoutes = require('./Chargers')
const accountRoutes = require('./Account')
const adminRoutes = require('./Admin')
const queueRoutes = require('./Queues')
const getAvailability = require('../services/Availability')
const { verifyAdmin } = require('../middleware/verifyAdmin')

// Set up standard root response
router.get('/', (req, res) => {
    res.json({ status: 'ok' })
})

// Use imported routes
router.use('/chargers', verifyLogin, chargerRoutes)
router.use('/account', verifyLogin, accountRoutes)
router.use('/admin', verifyAdmin, adminRoutes)
router.use('/queues', verifyLogin, queueRoutes)

router.post('/login', async function (req, res) {
    const { body } = req
    if (!body || !body.email) {
        res.status(400)
        res.send()
        return
    }
    const exists = await CheckUser(body.email)
    if (!exists) {
        await CreateUser(body.email)
    }
    await Login(req, res)
})

router.get('/verify-user', async function (req, res) {
    const { token, location } = req.query
    if (token == null) return res.sendStatus(401)
    const path = location ? `/charger/${location}` : '/chargers'
    try {
        const decodedToken = jwt.verify(token, await getJWTSecret())
        const user = await prisma.users.findFirst({
            where: {
                id: decodedToken.userId,
            },
        }) //remove localhost for deployment
        res.cookie('token', token, { httpOnly: true })
        const url =
            `${process.env.FRONTEND_URL || process.env.HOST_NAME}` + path
        res.redirect(url)
    } catch (error) {
        console.log(error)
        res.sendStatus(401)
    }
})

router.get('/login-check', verifyLogin, (req, res) => res.sendStatus(200))
router.get('/admin-check', verifyAdmin, (req, res) => res.sendStatus(200))

router.get('/location/:locationID/', async function (req, res) {
    try{
    const { params } = req
    if (params) {
        const { locationID } = params
        if (locationID) {
            const location = await prisma.location.findFirst({
                where: { locationID: +locationID },
                include: { chargingPoint: true, queue: true },
            })

            if(!location)
                res.status(404).send()

            location.queue = location.queue.length
            location.availability = getAvailability(location.chargingPoint)
            return res.json({ location })
        }
    }
    res.status(400).send()
}catch(err){
    res.status(500).send()
}
})

module.exports = router
