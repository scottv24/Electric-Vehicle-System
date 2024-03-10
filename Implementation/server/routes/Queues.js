const express = require('express')
const prisma = require('../prismaClient')
const router = express.Router()
const Prisma = require('@prisma/client')
router.get('/get-data', async function (req, res) {
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
    res.json({ queues })
})

async function getQueues(locations, time) {
    const queues = await prisma.$queryRaw`
    SELECT CAST(COUNT(*)+1 AS CHAR) AS 'position', queue.locationID, location.name, location.wattage
    FROM queue 
    INNER JOIN location ON queue.locationID = location.locationID
    WHERE queueEntryTime < ${new Date(time)} AND queue.locationID IN (${Prisma.join(locations)})
    GROUP BY queue.locationID
    ORDER BY position ASC;`
    return queues
}

module.exports = router
