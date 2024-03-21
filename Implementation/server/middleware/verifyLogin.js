const jwt = require('jsonwebtoken')
const prisma = require('../prismaClient')

async function verifyLogin(req, res, next) {
    try {
        const { token } = req.cookies
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

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
