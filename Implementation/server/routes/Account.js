const express = require('express')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router()
const jwt = require('jsonwebtoken')
const { sendLoginLink } = require('./mailer') //Email logic

//Testing purposes only - DELETE FOR RELEASE
router.get('/get-data', async function (req, res) {
    const accounts = await prisma.users.findMany()
    res.json({ accounts })
})

router.post('/create-user', async function (req, res) {
    const accountToPost = await prisma.users.create({
        data: {
            email: 'am454@hw.ac.uk',
            permissionLevel: 'USER',
            status: 'IDLE',
            pendingStartTime: '2024-03-05T00:02:08.000Z',
            chargePointID: null,
        },
    })
})

router.post('/login', async function (req, res) {
    const user = await prisma.users.findUnique({
        where: {
            email: 'am454@hw.ac.uk',
        },
    })

    if (user != null) {
        try {
            //const token = jwt.sign({})
            //})
            await sendLoginLink({ email: user, token })
        } catch (error) {
            return res.send('Error logging in, please try again')
        }
    }
    res.send('Check your email to finish logging in')
})

module.exports = router
