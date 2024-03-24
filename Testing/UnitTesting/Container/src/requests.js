const axios = require('axios')
const { GetJWT } = require('./authentication')

module.exports = { testRequest, verifyUser, getUserData, getLocationData, getAllChargerData, getChargerData, getQueueData, joinQueue, leaveQueue, checkIn, checkOut, cancelReservation }

var testEndpoint = process.env.TEST_ENDPOINT;

if(testEndpoint == undefined)
{
    console.log("Error: TEST_ENDPOINT is not set, using default")
    hostport = "http://127.0.0.1:8286/"
}

async function testRequest(){
    try {
        const res = await axios.get(
            `${testEndpoint}/api/location/${1}`,
            {}
        )

        return true

    } catch (err) {

        return false
    }
}

async function verifyUser(userID, token){

    if(token == undefined)
    {
        token = GetJWT(userID)
    }

    try {
        const res = await axios.get(
            `${testEndpoint}/api/verify-user?token=${token}`,
            {
                maxRedirects: 0,
                withCredentials: true,
                validateStatus: () => true
            }
        )

        return {status: "SUCCESS", data: res.data, httpStatus: res.status}

    } catch (err) {
        console.log("Error verifying user " + userID + "\n")
        console.log(err)

        return {status: "ERROR", errorMessage: err}
    }
}

async function getUserData(userID){
    try {
        const res = await axios.get(
            `${testEndpoint}/api/account/status`,
            {
                maxRedirects: 0,
                withCredentials: true,
                headers: {
                    Cookie: `token=${GetJWT(userID)}`
                },
            }
        )

        return {status: "SUCCESS", data: res.data, httpStatus: res.status}

    } catch (err) {
        console.log("Error getting status of user " + userID + "\n")
        console.log(err)

        return {status: "ERROR", errorMessage: err}
    }
}

async function getLocationData(locationID){
    try {
        const res = await axios.get(
            `${testEndpoint}/api/location/${locationID}`,
            {}
        )

        return {status: "SUCCESS", data: res.data, httpStatus: res.status}

    } catch (err) {
        console.log("Error getting location data " + locationID + "\n")
        console.log(err)

        return {status: "ERROR", errorMessage: err}
    }
}

async function getAllChargerData(){
    try {
        const res = await axios.get(
            `${testEndpoint}/api/chargers/`,
            {
                headers: {
                    Cookie: `token=${GetJWT(1)}`
                },
            }
        )

        return {status: "SUCCESS", data: res.data.chargers, httpStatus: res.status}

    } catch (err) {
        console.log("Error getting all charger data\n")
        console.log(err)

        return {status: "ERROR", errorMessage: err}
    }
}

async function getChargerData(chargerID){
    try {
        const res = await axios.get(
            `${testEndpoint}/api/chargers/`,
            {
                headers: {
                    Cookie: `token=${GetJWT(1)}`
                },
            }
        )

        const targetCharger = res.data.chargers.map((location) => location.chargingPoint.find((charger) => charger.chargingPointID == chargerID)).find((charger) => charger != undefined)

        return {status: "SUCCESS", data: targetCharger, httpStatus: res.status}

    } catch (err) {
        console.log("Error getting charger data " + chargerID + "\n")
        console.log(err)

        return {status: "ERROR", errorMessage: err}
    }
}

async function getQueueData(userID){
    try {
        const res = await axios.get(
            `${testEndpoint}/api/queues/`,
            {
                maxRedirects: 0,
                withCredentials: true,
                headers: {
                    Cookie: `token=${GetJWT(userID)}`
                },
            }
        )

        return {status: "SUCCESS", data: res.data, httpStatus: res.status}

    } catch (err) {
        console.log("Error getting queue data of user " + userID + "\n")
        console.log(err)

        return {status: "ERROR", errorMessage: err}
    }
}

async function joinQueue(userID, locationIDs){
    try {
        const res = await axios.post(
            `${testEndpoint}/api/queues/join-queue`,
            { locations: locationIDs },
            {
                headers: {
                    Cookie: `token=${GetJWT(userID)}`
                },
            }
        )

        return {status: "SUCCESS", data: res.data, httpStatus: res.status}

    } catch (err) {
        console.log("Error joining queue(s) " + locationIDs + " by user " + userID + "\n")
        console.log(err)

        return {status: "ERROR", errorMessage: err}
    }
}

async function leaveQueue(userID, locationIDs){
    try {

        const res = await axios.post(
            `${testEndpoint}/api/queues/leave-queue`,
            { locations: JSON.stringify(locationIDs) },
            {
                headers: {
                    Cookie: `token=${GetJWT(userID)}`
                },
            }
        )

        return {status: "SUCCESS", data: res.data, httpStatus: res.status}

    } catch (err) {
        console.log("Error leaving queue(s) " + locationIDs + " by user " + userID + "\n")
        console.log(err)

        return {status: "ERROR", errorMessage: err}
    }
}

async function checkIn(userID){
    try {

        const userData = await getUserData(userID)

        const res = await axios.patch(
            `${testEndpoint}/api/queues/check-in`,
            { chargingPointID: userData.data.chargingPointID },
            {
                headers: {
                    Cookie: `token=${GetJWT(userID)}`
                },
            }
        )

        return {status: "SUCCESS", data: res.data, httpStatus: res.status}

    } catch (err) {
        console.log("Error checking in user " + userID + "\n")
        console.log(err)

        return {status: "ERROR", errorMessage: err}
    }
}

async function checkOut(userID){
    try {
        const res = await axios.patch(
            `${testEndpoint}/api/queues/check-out`,
            {},
            {
                headers: {
                    Cookie: `token=${GetJWT(userID)}`
                },
            }
        )

        return {status: "SUCCESS", data: res.data, httpStatus: res.status}

    } catch (err) {
        console.log("Error checking out user " + userID + "\n")
        console.log(err)

        return {status: "ERROR", errorMessage: err}
    }
}

async function cancelReservation(userID){
    try {
        const res = await axios.patch(
            `${testEndpoint}/api/queues/cancel-reservation`,
            {},
            {
                headers: {
                    Cookie: `token=${GetJWT(userID)}`
                },
            }
        )

        return {status: "SUCCESS", data: res.data, httpStatus: res.status}

    } catch (err) {
        console.log("Error cancelling reservation for user " + userID + "\n")
        console.log(err)

        return {status: "ERROR", errorMessage: err}
    }
}
