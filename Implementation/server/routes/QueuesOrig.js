const express = require('express')

const { getPrismaClient } = require('../index')

const prisma = getPrismaClient()

const router = express.Router()
const Prisma = require('@prisma/client')

router.get('/', async function (req, res) {
    const locationsRaw = await prisma.queue.findMany({
        select: { locationID: true, queueEntryTime: true },
        where: { userID: 1 },
    })

    const locations = {}
    locationsRaw.forEach((location) => {
        const time = location.queueEntryTime
        if (locations[time]) {
            locations[time].push(location.locationID)
        } else {
            locations[time] = [location.locationID]
        }
    })

    const queues = []
    await Promise.all(
        Object.keys(locations).map(async (time) => {
            const queue = await getQueues(locations[time], time)
            queues.push(...queue)
            //console.log(queues)
            return
        }),
    )
    queues.sort((queue1, queue2) => queue1.position - queue2.position)
    console.log(queues)
    res.json({ queues })
})

async function getQueues(locations, time) {
    const queues = await prisma.$queryRaw`
    SELECT CAST(COUNT(*) AS CHAR) AS 'position', queue.locationID, location.name, location.wattage
    FROM queue 
    INNER JOIN location ON queue.locationID = location.locationID
    WHERE queueEntryTime <= ${new Date(time)} AND queue.locationID IN (${Prisma.join(locations)})
    GROUP BY queue.locationID
    ORDER BY position ASC;`
    return queues
}

router.post('/leave-queue', async function (req, res) {
    leaveQueue(req, res)
})

async function joinQueues(userID, locationsID) {
    const queueEntry = await prisma.queue.create({
        data: {
            locationID,
            userID,
        },
    })

    const updateUser = await prisma.user.update({
        where: {},

        data: {},
    })
}

async function leaveQueue(req, res) {
    const { body } = req
    const { locations, userID } = body
    const locationsList = JSON.parse(locations)
    console.log(locationsList)
    console.log(userID)
    if (!locations || !userID) {
        res.status(400).send()
    }

    await prisma.queue.deleteMany({
        where: {
            locationID: {
                in: locationsList,
            },
            userID,
        },
    })
    return res.send('Complete')
}

async function checkIn(user, locations, charger, userStatus, chargerStatus) {
    const checkInUser = await prisma.user.update({
        where: {
            id: user,
        },
        data: {
            status: 'CHARGING',
            chargePointID: charger,
        },
    })

    const checkInLocation = await prisma.chargingPoint.update({
        where: {
            locationID: locations,
        },
        data: {
            status: 'CHARGING',
        },
    })
}

async function checkOut(user, locations, charger, userStatus, chargerStatus) {
    const checkOutUser = await prisma.user.update({
        where: {
            id: user,
        },
        data: {
            status: 'IDLE',
            chargePointID: charger,
        },
    })

    const checkOutLocaion = await prisma.chargingPoint.update({
        where: {
            locationID: locations,
        },
        data: {
            status: 'IDLE',
        },
    })
}

module.exports = router
