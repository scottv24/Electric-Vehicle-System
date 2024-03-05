const express = require('express')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router()

router.get('/get-data', async function (req, res) {
    const chargers = await prisma.chargingPoint.findMany()
    res.json({ chargers })
})

module.exports = router
