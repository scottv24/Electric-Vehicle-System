const express = require('express')
var fs = require('fs')
const { PrismaClient } = require('@prisma/client')
const jwt = require('jsonwebtoken')
const getAvailability = require('../services/Availability')

var prisma

if (process.env.PRODUCTION == 'TRUE') {
    fs.readFile('/run/secrets/db-url', 'utf8', function (err, data) {
        if (err) {
            console.log(
                'Cannot find database connection URL. Is it set as a Docker secret correctly?',
            )

            throw err
        }

        prisma = new PrismaClient({
            datasources: {
                db: {
                    url: data,
                },
            },
        })
    })
} else {
    prisma = new PrismaClient()
}

const router = express.Router()

router.get('/', getChargers)

router.patch('/update-charger', updateCharger)

async function getChargers(req, res) {
    const chargers = await prisma.location.findMany({
        include: { chargingPoint: true, queue: true },
    })
    chargers.forEach((charger) => {
        charger.availability = getAvailability(charger.chargingPoint)
        charger.queue = charger.queue.length
    })

    res.json({ chargers })
}

async function updateCharger(req, res) {
    try {
        const { chargingPointID, status, message } = req.body
        if (!message && status !== 'BROKEN') {
            await prisma.chargingPoint.update({
                where: { chargingPointID },
                data: {
                    status,
                },
            })
        } else {
            await prisma.report.create({
                data: { chargingPointID, message },
            })
        }
        return res.sendStatus(200)
    } catch (err) {
        console.log('Error updating charger.')
        console.log(err)
        return res.sendStatus(500)
    }
}

async function getCharger() {
    const queues = await prisma.$queryRaw`
    SELECT CAST(COUNT(*)+1 AS CHAR) AS 'position', ChargingPoint.chargingPointID, ChargingPoint.status, ChargingPoint.locationID
    FROM chargingPoint
    WHERE queue.locationID IN (${Prisma.join(locations)})
    ORDER BY position ASC;`
    return queues
}

module.exports = router
