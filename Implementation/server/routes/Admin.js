const express = require('express')
var fs = require('fs')
const { PrismaClient } = require('@prisma/client')

var prisma = new PrismaClient();

if(process.env.MODE == 'PROD')
{
    fs.readFile("/run/secrets/db-url", 'utf8', function(err, data) {
        if (err) 
        {
            console.log("Cannot find database connection URL. Is it set as a Docker secret correctly?");

            throw err;
        }

        prisma = new PrismaClient({
            datasources: {
            db: {
                    url: data,
                },
            },
        });
    });
}
else
{
    prisma = new PrismaClient();
}

const router = express.Router()

router.patch('/set-permission-level', async function (req, res) {
    
    try {
        userID = req.query.userID;
        permLevel = req.query.permissionLevel;
        
        if(userID && permLevel && !isNaN(userID))
        {
            userID = parseInt(userID)

            //Check user exists
            try {
                await prisma.users.findUniqueOrThrow({
                    where: {
                    id: userID
                }});

            } catch (err) {
                if(err.name == "NotFoundError"){
                    res.sendStatus(404);

                    return;
                } else {
                    throw err;
                }
            }

            await prisma.users.update({ 
                where: { 
                    id: userID
                }, 
                data: {
                    permissionLevel: permLevel
                }});

            res.sendStatus(200);
        }
        else
        {
            res.sendStatus(400);
        }
    } catch (err) {

        console.log("Error when processing request admin/set-permission-level:\n\n" + err);

        res.sendStatus(500);
    }
})

router.get('/get-admin-users', async function (req, res)  {
    
    try {
        const admins = await prisma.users.findMany({ 
            where: {
            OR: [{ 
                permissionLevel: "ADMIN"
            }, { 
                permissionLevel: "SUPERADMIN"
            }]},
            select: {
                email: true
            }});

        res.json({ admins });

    } catch (err) {

        console.log("Error when processing request admin/get-admin-users:\n\n" + err);

        res.sendStatus(500);
    }
})

router.delete('/clear-queue', async function (req, res)  {
    
    try {
        locationID = req.query.locationID;

        if(locationID && !isNaN(locationID))
        {
            locationID = parseInt(locationID)

            //Check location exists
            try {
                await prisma.location.findUniqueOrThrow({
                    where: {
                        locationID: locationID
                }});
            } catch (err) {
                if(err.name == "NotFoundError"){
                    res.sendStatus(404);

                    return;
                } else {
                    throw err;
                }
            }

            await prisma.queue.deleteMany({ 
                where: {
                    locationID: locationID
                }});

            res.sendStatus(200);
        }
        else
        {
            res.sendStatus(400);
        }

    } catch (err) {

        console.log("Error when processing request admin/clear-queue:\n\n" + err);

        res.sendStatus(500);
    }
})

router.post('/update-location', async function (req, res)  {
    
    try {
        locationID = req.query.locationID;
        newName = req.query.name;
        newWattage = req.query.wattage;
        newLat = req.query.lat;
        newLng = req.query.lng;

        if(newName && newWattage && newLat && newLng)
        {
            //If locationID is undefined, set it to -1 so that it creates a new one
            if(!locationID)
            {
                locationID = -1;
            }

            if(isNaN(locationID) || isNaN(newWattage) || isNaN(newLat) || isNaN(newLng))
            {
                res.sendStatus(400);

                return;
            }

            locationID = parseInt(locationID)
            newWattage = parseInt(newWattage)
            newLat = parseInt(newLat)
            newLng = parseInt(newLng)

            const newLocation = await prisma.location.upsert({ 
                where: {
                    locationID: locationID
                }, update: {
                    name: newName,
                    wattage: newWattage,
                    lat: newLat,
                    lng: newLng
                }, create: {
                    name: newName,
                    wattage: newWattage,
                    lat: newLat,
                    lng: newLng
                }});

            res.json({ message: newLocation, status: 201 });
        }
        else
        {
            res.sendStatus(400);
        }

    } catch (err) {

        console.log("Error when processing request admin/update-location:\n\n" + err);

        res.sendStatus(500);
    }
})

router.post('/update-charging-point', async function (req, res)  {
    
    try {
        chargingPointID = req.query.chargingPointID;
        newStatus = req.query.status;
        newLocationID = req.query.locationID;

        if(newStatus && newLocationID)
        {
            //If chargingPointID is undefined, set it to -1 so that it creates a new one
            if(!chargingPointID)
            {
                chargingPointID = -1;
            }

            if(isNaN(chargingPointID) || isNaN(newLocationID))
            {
                res.sendStatus(400);

                return;
            }

            chargingPointID = parseInt(chargingPointID)
            newLocationID = parseInt(newLocationID)

            //Check location exists
            try {
                await prisma.location.findUniqueOrThrow({
                    where: {
                        locationID: newLocationID
                }});
            } catch (err) {
                if(err.name == "NotFoundError"){
                    res.sendStatus(404);

                    return;
                } else {
                    throw err;
                }
            }

            const newChargingPoint = await prisma.chargingPoint.upsert({ 
                where: {
                    chargingPointID: chargingPointID
                }, update: {
                    status: newStatus,
                    locationID: newLocationID
                }, create: {
                    status: newStatus,
                    locationID: newLocationID
                }});

            res.json({ message: newChargingPoint, status: 201 });
        }
        else
        {
            res.sendStatus(400);
        }

    } catch (err) {

        console.log("Error when processing request admin/update-charging-point:\n\n" + err);

        res.sendStatus(500);
    }
})

router.delete('/delete-location', async function (req, res)  {
    
    try {
        locationID = req.query.locationID;

        if(locationID && !isNaN(locationID))
        {
            locationID = parseInt(locationID)

            //Check location exists
            try {
                await prisma.location.findUniqueOrThrow({
                    where: {
                        locationID: locationID
                }});
            } catch (err) {
                if(err.name == "NotFoundError"){
                    res.sendStatus(404);

                    return;
                } else {
                    throw err;
                }
            }

            await prisma.location.delete({ 
                where: 
                {
                    locationID: locationID
                }});

            res.sendStatus(200);
        }
        else
        {
            res.sendStatus(400);
        }

    } catch (err) {

        console.log("Error when processing request admin/delete-location:\n\n" + err);

        res.sendStatus(500);
    }
})

router.delete('/delete-charging-point', async function (req, res)  {
    
    try {
        chargingPointID = req.query.chargingPointID;

        if(chargingPointID && !isNaN(chargingPointID))
        {
            chargingPointID = parseInt(chargingPointID)

            //Check charging point exists
            try {
                await prisma.chargingPoint.findUniqueOrThrow({
                    where: {
                        chargingPointID: chargingPointID
                }});
            } catch (err) {
                if(err.name == "NotFoundError"){
                    res.sendStatus(404);

                    return;
                } else {
                    throw err;
                }
            }

            await prisma.chargingPoint.delete({ 
                where: 
                {
                    chargingPointID: chargingPointID
                }});

            res.sendStatus(200);
        }
        else
        {
            res.sendStatus(400);
        }

    } catch (err) {

        console.log("Error when processing request admin/delete-charging-point:\n\n" + err);

        res.sendStatus(500);
    }
})

module.exports = router
