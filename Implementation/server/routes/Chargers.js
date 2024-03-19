const express = require('express')
var fs = require('fs')
const { PrismaClient } = require('@prisma/client')

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

router.get('/get-data', async function (req, res) {
    const chargers = await prisma.location.findMany({
        include: { chargingPoint: true, queue: true },
    })
    chargers.forEach((charger) => {
        charger.availability = getAvailability(charger.chargingPoint)
        charger.queue = charger.queue.length
    })
    console.log(chargers)
    res.json({ chargers })
})

router.get('/location/:locationID/get-data', async function (req, res) {
    const { params } = req
    if (params) {
        const { locationID } = params
        if (locationID) {
            const location = await prisma.location.findFirst({
                where: { locationID: +locationID },
                include: { chargingPoint: true, queue: true },
            })
            location.queue = location.queue.length
            location.availability = getAvailability(location.chargingPoint)
            return res.json({ location })
        }
    }
    res.status(400).send()
})

async function getCharger() {
    const queues = await prisma.$queryRaw`
    SELECT CAST(COUNT(*)+1 AS CHAR) AS 'position', ChargingPoint.chargingPointID, ChargingPoint.status, ChargingPoint.locationID
    FROM chargingPoint
    WHERE queue.locationID IN (${Prisma.join(locations)})
    ORDER BY position ASC;`
    return queues
}

function getAvailability(chargingPoints) {
    const available = chargingPoints.filter(
        (charger) => charger.status === 'IDLE',
    ).length
    const broken = chargingPoints.filter(
        (charger) => charger.status === 'BROKEN',
    ).length
    const charging = chargingPoints.filter(
        (charger) => charger.status === 'CHARGING',
    ).length
    const reserved = chargingPoints.filter(
        (charger) => charger.status === 'BROKEN',
    ).length
    const numChargers = chargingPoints.length
    const availability = { numChargers, available, broken, charging, reserved }
    return availability
}

module.exports = router
