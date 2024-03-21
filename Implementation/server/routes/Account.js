const express = require('express')
const prisma = require('../prismaClient')

const router = express.Router()

//const { sendLoginLink } = require('./mailer') //Email logic

//Testing purposes only - DELETE FOR RELEASE
router.get('/', async function (req, res) {
    const accounts = await prisma.users.findMany()
    res.json({ accounts })
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
