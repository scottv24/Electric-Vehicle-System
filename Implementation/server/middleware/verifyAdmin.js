const jwt = require('jsonwebtoken')

const { getPrismaClient, getJWTSecret } = require('../index')

const prisma = getPrismaClient()

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
        console.log(err)
        res.status(403)
        res.send()
    }
}

exports.verifyAdmin = verifyAdmin
