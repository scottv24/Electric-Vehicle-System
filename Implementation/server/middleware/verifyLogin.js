const jwt = require('jsonwebtoken')

const { getJWTSecret, getPrismaClient} = require('../index')

const prisma = getPrismaClient()

async function verifyLogin(req, res, next) {
    try {
        const { token } = req.cookies
        const decodedToken = jwt.verify(token, await getJWTSecret())

        const user = await prisma.users.findFirst({
            where: {
                id: decodedToken.userId,
            },
        })
        if (user) {
            next()
        } else {
            res.clearCookie('token')
            return res.sendStatus(403)
        }
    } catch (err) {
        res.clearCookie('token')
        res.status(403)
        res.send()
    }
}

exports.verifyLogin = verifyLogin
