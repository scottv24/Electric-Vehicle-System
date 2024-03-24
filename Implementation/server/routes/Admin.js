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
        let { chargingPoint, locationID, wattage, lat, lng, name, noChargers } =
            req.body
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
            wattage = +wattage
            lat = +lat
            lng = +lng
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
            if (noChargers) {
                const chargers = []
                for (let i = 0; i < noChargers; i++) {
                    chargers.push({
                        locationID: newLocation.locationID,
                        status: 'IDLE',
                    })
                }

                chargingPoint = chargers
            }
            const statusCodes = await Promise.all(
                chargingPoint.map(
                    async (charger) => await UpdateCharger(charger),
                ),
            )

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
            chargingPointID = +chargingPointID

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

router.get('/report', getReport)
router.patch('/validate-broken', validateBroken)
router.patch('/remove-report', removeReport)
router.get('/report-count', getReportCount)

async function getReport(req, res) {
    try {
        const report = await prisma.report.findMany({
            include: { chargingPoint: { include: { location: true } } },
        })

        // Get the chargers numbers relative to their locations
        await Promise.all(
            report.map(async (charger) => {
                const chargerLocationID = await getChargerLocationID(
                    charger.chargingPointID,
                    charger.chargingPoint.locationID,
                )
                charger.chargerLocationID = chargerLocationID
            }),
        )

        return res.json({ report })
    } catch (err) {
        console.log('Error getting admin reports.')
        console.log(err)
        return res.sendStatus(500)
    }
}

async function getChargerLocationID(chargingPointID, locationID) {
    const locationChargers = await prisma.chargingPoint.findMany({
        where: {
            locationID: locationID,
            chargingPointID: {
                lt: chargingPointID,
            },
        },
    })
    return locationChargers.length + 1
}

async function validateBroken(req, res) {
    try {
        const { chargingPointID } = req.body
        await prisma.chargingPoint.update({
            where: { chargingPointID },
            data: { status: 'BROKEN' },
        })
        await prisma.report.deleteMany({
            where: { chargingPointID },
        })
        return res.sendStatus(200)
    } catch (err) {
        console.log('Error validating admin report.')
        console.log(err)
        return res.sendStatus(500)
    }
}

async function removeReport(req, res) {
    try {
        const { reportID } = req.body
        await prisma.report.delete({
            where: { reportID },
        })
        return res.sendStatus(200)
    } catch (err) {
        console.log('Error removing admin report.')
        console.log(err)
        return res.sendStatus(500)
    }
}

async function getReportCount(req, res) {
    try {
        const reports = await prisma.report.findMany()
        res.json({ count: reports.length })
    } catch (err) {
        console.log('Error getting report count.')
        console.log(err)
        return res.sendStatus(500)
    }
}
module.exports = router
