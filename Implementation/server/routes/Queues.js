const express = require('express')
var fs = require('fs')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const Prisma = require('@prisma/client')
const { getUserID } = require('../services/Login')
let prisma

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

router.get('/', async function (req, res) {
    const userID = await getUserID(req)
    const locationsRaw = await prisma.queue.findMany({
        select: { locationID: true, queueEntryTime: true },
        where: { userID },
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
    await leaveQueue(req, res)
})

router.post('/join-queue', async function (req, res) {
    await joinQueues(req, res)
})

router.patch('/check-in', async function (req, res) {
    await checkIn(req, res)
})

router.patch('/check-out', async function (req, res) {
    await checkOut(req, res)
})

router.patch('/cancel-reservation', async function (req, res) {
    await cancelReservation(req, res)
})

async function joinQueues(req, res) {
    try {
        const { body } = req
        const userID = await getUserID(req)
        let { locations } = body

        if (!locations || !userID || isNaN(userID)) {
            return res.status(400).send()
        }

        //Check user exists
        try {
            const userDetails = await prisma.users.findUniqueOrThrow({
                where: {
                    id: userID,
                },
            })

            //If the user is already charging or pending, they cannot queue
            if (
                userDetails.status == 'CHARGING' ||
                userDetails.status == 'PENDING'
            ) {
                return res.status(418).send()
            }
        } catch (err) {
            if (err.name == 'NotFoundError') {
                return res.sendStatus(404)
            } else {
                throw err
            }
        }

        const availableChargingPts = await prisma.chargingPoint.findMany({
            where: {
                locationID: { in: locations },
                status: 'IDLE',
            },
        })

        if (availableChargingPts.length > 0) {
            await prisma.users.update({
                where: { id: userID },
                data: {
                    status: 'PENDING',
                    chargePointID: availableChargingPts[0].chargingPointID,
                },
            })

            await prisma.chargingPoint.update({
                where: {
                    chargingPointID: availableChargingPts[0].chargingPointID,
                },
                data: { status: 'RESERVED' },
            })
            const locationChargers = await prisma.chargingPoint.findMany({
                where: {
                    locationID: availableChargingPts[0].locationID,
                    chargingPointID: {
                        lt: availableChargingPts[0].chargingPointID,
                    },
                },
            })
            return res.json({
                chargingPointID: availableChargingPts[0].chargingPointID,
                chargerLocationID: locationChargers.length + 1,
            })
        } else {
            let locationsList = []

            for (let i = 0; i < locations.length; i++) {
                locationsList.push({ userID: userID, locationID: locations[i] })
            }

            currentUserQueues = await prisma.queue.findMany({
                where: {
                    userID: userID,
                },
            })

            //Make sure that the user is not trying to queue for a location that they are already in queue for
            locationsList = locationsList.filter(
                (loc) =>
                    !currentUserQueues.find(
                        (queue) => loc.locationID == queue.locationID,
                    ),
            )

            await prisma.queue.createMany({
                data: locationsList,
            })

            await prisma.users.update({
                where: { id: userID },
                data: { status: 'WAITING' },
            })

            return res.sendStatus(200)
        }
    } catch (err) {
        console.log(
            'Error when processing request queues/join-queue:\n\n' + err,
        )

        res.sendStatus(500)
    }
}

async function leaveQueue(req, res) {
    const { body } = req
    const { locations } = body
    const userID = getUserID(req)
    const locationsList = JSON.parse(locations)

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

async function checkIn(req, res) {
    try {
        const { body } = req
        const { chargingPointID } = body
        const userID = await getUserID(req)
        if (!userID || !chargingPointID) {
            console.log(chargingPointID)
            return res.sendStatus(400)
        }
        await prisma.users.update({
            where: {
                id: userID,
            },
            data: {
                status: 'CHARGING',
                chargePointID: chargingPointID,
                pendingStartTime: new Date(),
            },
        })

        await prisma.queue.deleteMany({
            where: {
                userID,
            },
        })

        await prisma.chargingPoint.update({
            where: {
                chargingPointID,
            },
            data: {
                status: 'CHARGING',
            },
        })
        return res.sendStatus(200)
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}

async function checkOut(req, res) {
    const userID = await getUserID(req)
    if (!userID) {
        return res.sendStatus(400)
    }
    removeUserFromPoint(res, userID)
}

async function removeUserFromPoint(res, userID) {
    const user = await prisma.users.findUnique({
        where: { id: userID },
    })

    await prisma.users.update({
        where: { id: userID },
        data: { status: 'IDLE', chargePointID: null },
    })
    freeChargingPoint(user.chargePointID, res)
}

async function freeChargingPoint(chargingPointID, res) {
    try {
        const chargingPoint = await prisma.chargingPoint.findUnique({
            where: { chargingPointID },
        })

        const nextInQueue = await prisma.$queryRaw`
        SELECT * FROM queue 
        INNER JOIN users 
        ON queue.userID = users.id 
        WHERE users.status = 'WAITING'
        ORDER BY queue.queueEntryTime ASC`

        if (nextInQueue.length) {
            await prisma.users.update({
                where: { id: nextInQueue[0].userID },
                data: {
                    status: 'PENDING',
                    pendingStartTime: new Date(),
                    chargePointID: chargingPointID,
                },
            })

            await prisma.chargingPoint.update({
                where: { chargingPointID: chargingPointID },
                data: { status: 'RESERVED' },
            })
        } else {
            await prisma.chargingPoint.update({
                where: { chargingPointID: chargingPointID },
                data: { status: 'IDLE' },
            })
        }
        return res.sendStatus(200)
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}

async function cancelReservation(req, res) {
    try {
        const id = await getUserID(req)
        const user = await prisma.users.findFirst({
            where: { id },
        })
        await prisma.users.update({
            where: { id },
            data: { chargePointID: null, status: 'WAITING' },
        })
        freeChargingPoint(user.chargePointID, res)
    } catch (err) {
        return res.sendStatus(500)
    }
}

//setInterval(timeInQueueChecker(), 60000)
// setInterval(timeCheckedInChecker(), 60000)
//setInterval(timeChargerChecker(), 60000)

async function timeChargerChecker() {
    const time = new Date()
    const maximumChargeTime = await prisma.keyValues.findFirst({
        select: { maximumChargeTime: true },
    })

    const minutes = maximumChargeTime % 60
    const hours = Math.floor(maximumChargeTime / 60)

    time.setHours(time.getHours() - hours)
    time.setMinutes(time.getMinutes() - minutes)

    const usersToRemove = await prisma.user.findMany({
        where: {
            pendingStartTime: { lt: time },
            status: 'CHARGING',
        },
        include: { users: true },
    })

    await prisma.user.updateMany({
        where: { id: usersToRemove.map((user) => user.id) },
        data: { status: 'IDLE' },
    })

    usersToRemove.forEach((user) => {
        freeChargingPoint(user.chargingPointID)
    })

    // const updatedWaitng = await prisma.queue.findMany({
    //     where: {
    //         status: 'WAITING',
    //     },
    //     orderBy: { queueEntryTime: 'asc' },
    // })

    // await prisma.user.updateMany({
    //     where: { id: updatedWaitng.userID, status: 'WAITING' },
    //     data: { status: 'PENDING' },
    // })

    return updatedPending
}

// async function pendingTimeCheck() {
//     const time = new Date()
//     const maximumPendingTime = await prisma.keyValues.findFirst({
//         select: { maximumPendingTime: true },
//     })

//     const minutes = maximumPendingTime % 60
//     const hours = Math.floor(maximumPendingTime / 60)
//     time.setHours(time.getHours() - hours)
//     time.setMinutes(time.getMinutes() - minutes)

//     const updatedPending = await prisma.user.findMany({
//         where: {
//             pendingStartTime: { lt: time },
//         },
//         include: { users: true },
//     })

//     const updatedWaiting = await prisma.queuek.findFirst({
//         where: { status: 'WAITING' },
//         select: { userID: true },
//         orderBy: { pendingStartTime: 'asc' },
//     })

//     await prisma.queue.updateMany({
//         where: { userID: updatedPending.user, status: 'PENDING' },
//         data: { status: 'WAITING' },
//     })

//     await prisma.queue.updateMany({
//         where: { userID: updatedWaiting.user, status: 'WAITING' },
//         data: { status: 'PENDING' },
//     })

//     return
// }

async function timeInQueueChecker() {
    const time = new Date()
    const checkQueueInterval = await prisma.keyValues.findFirst({
        select: { checkQueueInterval: true },
    })
    const minutes = checkQueueInterval % 60
    const hours = Math.floor(checkQueueInterval / 60)
    time.setHours(time.getHours() - hours)
    time.setMinutes(time.getMinutes() - minutes)

    const deletedQueuers = await prisma.queue.findMany({
        where: {
            queueEntryTime: {
                lt: time,
            },
        },
        include: { users: true, location: true },
    })

    await prisma.queue.deleteMany({
        where: {
            queueEntryTime: {
                lt: time,
            },
        },
    })
    await prisma.user.update({
        where: { queue: { is: null }, status: 'WAITING' },
        data: { status: 'IDLE' },
    })

    return deletedQueuers
}
module.exports = router
