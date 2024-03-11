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
    res.json({ chargers })
})

async function getCharger() {
    const queues = await prisma.$queryRaw`
    SELECT CAST(COUNT(*)+1 AS CHAR) AS 'position', ChargingPoint.chargingPointID, ChargingPoint.status, ChargingPoint.locationID
    FROM chargingPoint
    WHERE queue.locationID IN (${Prisma.join(locations)})
    ORDER BY position ASC;`
    return queues
}


module.exports = router
