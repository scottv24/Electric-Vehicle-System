const express = require('express')
const { prisma } = require('../prismaClient')
const { CheckUser, Login, CreateUser } = require('../services/Login')
const router = express.Router()

//const { sendLoginLink } = require('./mailer') //Email logic

//Testing purposes only - DELETE FOR RELEASE
router.get('/get-data', async function (req, res) {
    const accounts = await prisma.users.findMany()
    res.json({ accounts })
})

router.post('/login', async function (req, res) {
    const { body } = req
    if (!body || !body.email) {
        res.status(400)
        res.send()
        return
    }
    const exists = await CheckUser(body.email)
    if (!exists) {
        await CreateUser(body.email)
    }
    await Login(req, res)
})

router.get('/verify-user', async function (req, res) {
    const token = req.query.token
    if (token == null) return res.sendStatus(401)

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const user = await prisma.users.findFirst({
            where: {
                id: decodedToken.userId,
            },
        })
        res.send('Authenticated, welcome')
    } catch (error) {
        res.sendStatus(401)
    }
})

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
