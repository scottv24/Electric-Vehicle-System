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

const router = express.Router()

router.patch('/set-permission-level', async function (req, res) {
    try {
        email = req.body.email
        permLevel = req.body.permissionLevel
        if (email && permLevel) {
            //Check user exists
            try {
                await prisma.users.findFirstOrThrow({
                    where: {
                        email: email,
                    },
                })
            } catch (err) {
                if (err.name == 'NotFoundError') {
                    console.log(err)
                    res.sendStatus(404)

                    return
                } else {
                    throw err
                }
            }

            await prisma.users.updateMany({
                where: {
                    email: email,
                },
                data: {
                    permissionLevel: permLevel,
                },
            })

            res.sendStatus(200)
        } else {
            res.sendStatus(400)
        }
    } catch (err) {
        console.log(
            'Error when processing request admin/set-permission-level:\n\n' +
                err,
        )

        res.sendStatus(500)
    }
})

router.get('/get-admin-users', async function (req, res) {
    try {
        const admins = await prisma.users.findMany({
            where: {
                OR: [
                    {
                        permissionLevel: 'ADMIN',
                    },
                    {
                        permissionLevel: 'SUPERADMIN',
                    },
                ],
            },
            select: {
                email: true,
            },
        })
        res.json({ admins })
    } catch (err) {
        console.log(
            'Error when processing request admin/get-admin-users:\n\n' + err,
        )
        res.sendStatus(500)
    }
})

router.delete('/clear-queue', async function (req, res) {
    try {
        locationID = req.body.locationID

        if (locationID && !isNaN(locationID)) {
            locationID = parseInt(locationID)

            //Check location exists
            try {
                await prisma.location.findUniqueOrThrow({
                    where: {
                        locationID: locationID,
                    },
                })
            } catch (err) {
                if (err.name == 'NotFoundError') {
                    res.sendStatus(404)

                    return
                } else {
                    throw err
                }
            }

            await prisma.queue.deleteMany({
                where: {
                    locationID: locationID,
                },
            })

            res.sendStatus(200)
        } else {
            res.sendStatus(400)
        }
    } catch (err) {
        console.log(
            'Error when processing request admin/clear-queue:\n\n' + err,
        )

        res.sendStatus(500)
    }
})

router.patch('/update-location', async function (req, res) {
    try {
        const { location } = req.body
        let { chargingPoint, locationID, wattage, lat, lng, name } = req.body
        const filteredChargers = chargingPoint.filter(
            (charger) => charger.updated,
        )
        if (name && wattage && lat && lng) {
            //If locationID is undefined, set it to -1 so that it creates a new one
            if (!locationID) {
                locationID = -1
            }

            if (
                isNaN(locationID) ||
                isNaN(wattage) ||
                isNaN(lat) ||
                isNaN(lng)
            ) {
                res.sendStatus(400)

                return
            }

            locationID = parseInt(locationID)
            wattage = parseInt(wattage)
            lat = parseInt(lat)
            lng = parseInt(lng)
            const newLocation = await prisma.location.upsert({
                where: {
                    locationID: locationID,
                },
                update: {
                    name: name,
                    wattage: wattage,
                    lat: lat,
                    lng: lng,
                },
                create: {
                    name: name,
                    wattage: wattage,
                    lat: lat,
                    lng: lng,
                },
            })
            console.log(chargingPoint)
            const statusCodes = await Promise.all(
                chargingPoint.map(
                    async (charger) => await UpdateCharger(charger),
                ),
            )
            console.log(statusCodes)
            res.json({ message: newLocation, status: 201 })
        } else {
            res.sendStatus(400)
        }
    } catch (err) {
        console.log(
            'Error when processing request admin/update-location:\n\n' + err,
        )

        res.sendStatus(500)
    }
})
async function UpdateCharger(chargingPoint) {
    try {
        chargingPointID = chargingPoint.chargingPointID
        newStatus = chargingPoint.status
        newLocationID = chargingPoint.locationID
        if (newStatus) {
            //If chargingPointID is undefined, set it to -1 so that it creates a new one
            if (!chargingPointID) {
                chargingPointID = -1
            }

            if (isNaN(chargingPointID)) {
                return 400
            }

            chargingPointID = parseInt(chargingPointID)

            const newChargingPoint = await prisma.chargingPoint.upsert({
                where: {
                    chargingPointID: chargingPointID,
                },
                update: {
                    status: newStatus,
                    locationID: newLocationID,
                },
                create: {
                    status: newStatus,
                    locationID: newLocationID,
                },
            })

            return 201
        } else {
            return 400
        }
    } catch (err) {
        console.log(
            'Error when processing request admin/update-charging-point:\n\n' +
                err,
        )

        return 500
    }
}

router.post('/update-charging-point', async function (req, res) {
    try {
        chargingPointID = req.body.chargingPointID
        newStatus = req.body.status
        newLocationID = req.body.locationID

        if (newStatus && newLocationID) {
            //If chargingPointID is undefined, set it to -1 so that it creates a new one
            if (!chargingPointID) {
                chargingPointID = -1
            }

            if (isNaN(chargingPointID) || isNaN(newLocationID)) {
                return 400
            }

            chargingPointID = parseInt(chargingPointID)
            newLocationID = parseInt(newLocationID)

            //Check location exists
            try {
                await prisma.location.findUniqueOrThrow({
                    where: {
                        locationID: newLocationID,
                    },
                })
            } catch (err) {
                if (err.name == 'NotFoundError') {
                    return 404
                } else {
                    throw err
                }
            }

            const newChargingPoint = await prisma.chargingPoint.upsert({
                where: {
                    chargingPointID: chargingPointID,
                },
                update: {
                    status: newStatus,
                    locationID: newLocationID,
                },
                create: {
                    status: newStatus,
                    locationID: newLocationID,
                },
            })

            return 201
        } else {
            return 400
        }
    } catch (err) {
        console.log(
            'Error when processing request admin/update-charging-point:\n\n' +
                err,
        )

        return 500
    }
})

router.delete('/delete-location', async function (req, res) {
    try {
        locationID = req.body.locationID

        if (locationID && !isNaN(locationID)) {
            locationID = parseInt(locationID)

            //Check location exists
            try {
                await prisma.location.findUniqueOrThrow({
                    where: {
                        locationID: locationID,
                    },
                })
            } catch (err) {
                if (err.name == 'NotFoundError') {
                    res.sendStatus(404)

                    return
                } else {
                    throw err
                }
            }

            await prisma.location.delete({
                where: {
                    locationID: locationID,
                },
            })

            res.sendStatus(200)
        } else {
            res.sendStatus(400)
        }
    } catch (err) {
        console.log(
            'Error when processing request admin/delete-location:\n\n' + err,
        )

        res.sendStatus(500)
    }
})

router.delete('/delete-charging-point', async function (req, res) {
    try {
        chargingPointID = req.body.chargingPointID

        if (chargingPointID && !isNaN(chargingPointID)) {
            chargingPointID = parseInt(chargingPointID)

            //Check charging point exists
            try {
                await prisma.chargingPoint.findUniqueOrThrow({
                    where: {
                        chargingPointID: chargingPointID,
                    },
                })
            } catch (err) {
                if (err.name == 'NotFoundError') {
                    res.sendStatus(404)

                    return
                } else {
                    throw err
                }
            }

            await prisma.chargingPoint.delete({
                where: {
                    chargingPointID: chargingPointID,
                },
            })

            res.sendStatus(200)
        } else {
            res.sendStatus(400)
        }
    } catch (err) {
        console.log(
            'Error when processing request admin/delete-charging-point:\n\n' +
                err,
        )

        res.sendStatus(500)
    }
})

module.exports = router
