const jwt = require('jsonwebtoken')
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

const { getJWTSecret } = require('../index')

async function verifyAdmin(req, res, next) {
    try {
        const { token } = req.cookies
        const decodedToken = jwt.verify(token, await getJWTSecret())

        const user = await prisma.users.findFirst({
            where: {
                id: decodedToken.userId,
                permissionLevel: 'ADMIN',
            },
        })
        if (user) {
            next()
        } else {
            return res.sendStatus(403)
        }
    } catch (err) {
        res.status(403)
        res.send()
    }
}

exports.verifyAdmin = verifyAdmin
