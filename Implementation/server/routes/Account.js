const express = require('express')
var fs = require('fs')
const { PrismaClient } = require('@prisma/client')

var prisma = new PrismaClient()

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
const { getUserID } = require('../services/Login')

const router = express.Router()

//const { sendLoginLink } = require('./mailer') //Email logic

//Testing purposes only - DELETE FOR RELEASE
router.get('/', async function (req, res) {
    const accounts = await prisma.users.findMany()
    res.json({ accounts })
})

router.get('/status', async function (req, res) {
    await checkUserStatus(req, res)
})

async function checkUserStatus(req, res) {
    const id = await getUserID(req)
    const { status, pendingStartTime, chargingPoint } =
        await prisma.users.findFirst({
            where: {
                id,
            },
            include: { chargingPoint: true },
        })
    let body = { status }
    if (status && (status === 'PENDING' || status === 'CHARGING')) {
        const prevChargers = await prisma.chargingPoint.findMany({
            where: {
                locationID: chargingPoint.locationID,
                chargingPointID: { lte: chargingPoint.chargingPointID },
            },
            include: { location: true },
        })
        body.chargingPointID = chargingPoint.chargingPointID
        body.chargerLocationID = prevChargers.length
        body.pendingStartTime = pendingStartTime
        body.location = prevChargers[0].location.name
    }
    return res.json(body)
}

router.patch('/logout', logOut)
router.patch('/delete-account', deleteAccount)

async function logOut(req, res) {
    try {
        res.clearCookie('token')
        res.status(200)
        res.send()
    } catch (err) {
        console.log('Error logging out.')
        res.sendStatus(500)
    }
}

async function deleteAccount(req, res) {
    try {
        const id = await getUserID(req)
        await prisma.users.delete({
            where: { id },
        })
        res.sendStatus(200)
    } catch (err) {
        console.log('Error deleting account.')
        res.sendStatus(500)
    }
}

// crypto.subtle
//     .generateKey(
//         {
//             name: 'HMAC',
//             hash: { name: 'SHA-256' },
//         },
//         true,
//         ['sign', 'verify'],
//     )
//     .then((key) => {
//         crypto.subtle.exportKey('jwk', key).then((exported) => {
//             console.log(exported.k)
//         })
//     })

module.exports = router
