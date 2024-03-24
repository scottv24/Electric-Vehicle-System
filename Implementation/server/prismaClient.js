const { PrismaClient } = require('@prisma/client')

let prisma

if (process.env.MODE == 'PROD') {
    //prisma = new PrismaClient()
} else {
    if (!global.prisma) {
        //global.prisma = new PrismaClient()
    }

    prisma = global.prisma
}

module.exports = prisma
