const express = require('express')
const router = express.Router()

// Import nested routes
const chargerRoutes = require('./Chargers')
const accountRoutes = require('./Account')
const adminRoutes = require('./Admin')

// Set up standard root response
router.get('/', (req, res) => {
    res.json({ status: 'ok' })
})

// Use imported routes
router.use('/chargers', chargerRoutes)
router.use('/account', accountRoutes)
router.use('/admin', adminRoutes)

module.exports = router
