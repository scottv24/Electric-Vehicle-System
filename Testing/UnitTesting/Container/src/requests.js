const axios = require('axios')
const { GetJWT } = require('./authentication')

module.exports = { testRequest, verifyUser, getUserData, getLocationData, getAllChargerData, getChargerData, getQueueData, joinQueue, leaveQueue, checkIn, checkOut, cancelReservation,
    setPermissionLevel, getAdminUsers, clearQueue, updateLocation, updateChargingPoint, deleteLocation, deleteChargingPoint }

var testEndpoint = process.env.TEST_ENDPOINT;

if(testEndpoint == undefined)
{
    console.log("Error: TEST_ENDPOINT is not set, using default")
    hostport = "http://127.0.0.1:8286/"
}

async function testRequest(successStatus = (httpStatus) => httpStatus >= 200 && httpStatus < 400){
    try {
        const res = await axios.get(
            `${testEndpoint}/api/location/${1}`,
            {
                validateStatus: (httpStatus) => successStatus(httpStatus)
            }
        )

        return true

    } catch (err) {

        return false
    }
}

async function verifyUser(userID, token, successStatus = (httpStatus) => httpStatus >= 200 && httpStatus < 400){

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
                validateStatus: (httpStatus) => successStatus(httpStatus)
            }
        )

        return {status: "SUCCESS", data: res.data, httpStatus: res.status}

    } catch (err) {
        console.log("Error verifying user " + userID + "\n")
        console.log(err)

        return {status: "ERROR", errorMessage: err}
    }
}

async function getUserData(userID, successStatus = (httpStatus) => httpStatus >= 200 && httpStatus < 400){
    try {
        const res = await axios.get(
            `${testEndpoint}/api/account/status`,
            {
                maxRedirects: 0,
                withCredentials: true,
                headers: {
                    Cookie: `token=${GetJWT(userID)}`
                },
                validateStatus: (httpStatus) => successStatus(httpStatus)
            }
        )

        return {status: "SUCCESS", data: res.data, httpStatus: res.status}

    } catch (err) {
        console.log("Error getting status of user " + userID + "\n")
        console.log(err)

        return {status: "ERROR", errorMessage: err}
    }
}

async function getLocationData(locationID, successStatus = (httpStatus) => httpStatus >= 200 && httpStatus < 400){
    try {
        const res = await axios.get(
            `${testEndpoint}/api/location/${locationID}`,
            {
                validateStatus: (httpStatus) => successStatus(httpStatus)
            }
        )

        return {status: "SUCCESS", data: res.data, httpStatus: res.status}

    } catch (err) {
        console.log("Error getting location data " + locationID + "\n")
        console.log(err)

        return {status: "ERROR", errorMessage: err}
    }
}

async function getAllChargerData(successStatus = (httpStatus) => httpStatus >= 200 && httpStatus < 400){
    try {
        const res = await axios.get(
            `${testEndpoint}/api/chargers/`,
            {
                headers: {
                    Cookie: `token=${GetJWT(1)}`
                },
                validateStatus: (httpStatus) => successStatus(httpStatus)
            }
        )

        return {status: "SUCCESS", data: res.data.chargers, httpStatus: res.status}

    } catch (err) {
        console.log("Error getting all charger data\n")
        console.log(err)

        return {status: "ERROR", errorMessage: err}
    }
}

async function getChargerData(chargerID, successStatus = (httpStatus) => httpStatus >= 200 && httpStatus < 400){
    try {
        const res = await axios.get(
            `${testEndpoint}/api/chargers/`,
            {
                headers: {
                    Cookie: `token=${GetJWT(1)}`
                },
                validateStatus: (httpStatus) => successStatus(httpStatus)
            }
        )

        const targetCharger = res.data.chargers.map((location) => location.chargingPoint.find((charger) => charger.chargingPointID == chargerID)).find((charger) => charger != undefined)

        return {status: "SUCCESS", data: targetCharger, httpStatus: res.status}

    } catch (err) {
        console.log("Error getting charger " + chargerID + " data\n")
        console.log(err)

        return {status: "ERROR", errorMessage: err}
    }
}

async function getQueueData(userID, successStatus = (httpStatus) => httpStatus >= 200 && httpStatus < 400){
    try {
        const res = await axios.get(
            `${testEndpoint}/api/queues/`,
            {
                maxRedirects: 0,
                withCredentials: true,
                headers: {
                    Cookie: `token=${GetJWT(userID)}`
                },
                validateStatus: (httpStatus) => successStatus(httpStatus)
            }
        )

        return {status: "SUCCESS", data: res.data, httpStatus: res.status}

    } catch (err) {
        console.log("Error getting queue data of user " + userID + "\n")
        console.log(err)

        return {status: "ERROR", errorMessage: err}
    }
}

async function joinQueue(userID, locationIDs, successStatus = (httpStatus) => httpStatus >= 200 && httpStatus < 400){
    try {
        const res = await axios.post(
            `${testEndpoint}/api/queues/join-queue`,
            { locations: locationIDs },
            {
                headers: {
                    Cookie: `token=${GetJWT(userID)}`
                },
                validateStatus: (httpStatus) => successStatus(httpStatus)
            }
        )

        return {status: "SUCCESS", data: res.data, httpStatus: res.status}

    } catch (err) {
        console.log("Error joining queue(s) " + locationIDs + " by user " + userID + "\n")
        console.log(err)

        return {status: "ERROR", errorMessage: err}
    }
}

async function leaveQueue(userID, locationIDs, successStatus = (httpStatus) => httpStatus >= 200 && httpStatus < 400){
    try {

        const res = await axios.post(
            `${testEndpoint}/api/queues/leave-queue`,
            { locations: JSON.stringify(locationIDs) },
            {
                headers: {
                    Cookie: `token=${GetJWT(userID)}`
                },
                validateStatus: (httpStatus) => successStatus(httpStatus)
            }
        )

        return {status: "SUCCESS", data: res.data, httpStatus: res.status}

    } catch (err) {
        console.log("Error leaving queue(s) " + locationIDs + " by user " + userID + "\n")
        console.log(err)

        return {status: "ERROR", errorMessage: err}
    }
}

async function checkIn(userID, successStatus = (httpStatus) => httpStatus >= 200 && httpStatus < 400){
    try {

        const userData = await getUserData(userID)

        const res = await axios.patch(
            `${testEndpoint}/api/queues/check-in`,
            { chargingPointID: userData.data.chargingPointID },
            {
                headers: {
                    Cookie: `token=${GetJWT(userID)}`
                },
                validateStatus: (httpStatus) => successStatus(httpStatus)
            }
        )

        return {status: "SUCCESS", data: res.data, httpStatus: res.status}

    } catch (err) {
        console.log("Error checking in user " + userID + "\n")
        console.log(err)

        return {status: "ERROR", errorMessage: err}
    }
}

async function checkOut(userID, successStatus = (httpStatus) => httpStatus >= 200 && httpStatus < 400){
    try {
        const res = await axios.patch(
            `${testEndpoint}/api/queues/check-out`,
            {},
            {
                headers: {
                    Cookie: `token=${GetJWT(userID)}`
                },
                validateStatus: (httpStatus) => successStatus(httpStatus)
            }
        )

        return {status: "SUCCESS", data: res.data, httpStatus: res.status}

    } catch (err) {
        console.log("Error checking out user " + userID + "\n")
        console.log(err)

        return {status: "ERROR", errorMessage: err}
    }
}

async function cancelReservation(userID, successStatus = (httpStatus) => httpStatus >= 200 && httpStatus < 400){
    try {
        const res = await axios.patch(
            `${testEndpoint}/api/queues/cancel-reservation`,
            {},
            {
                headers: {
                    Cookie: `token=${GetJWT(userID)}`
                },
                validateStatus: (httpStatus) => successStatus(httpStatus)
            }
        )

        return {status: "SUCCESS", data: res.data, httpStatus: res.status}

    } catch (err) {
        console.log("Error cancelling reservation for user " + userID + "\n")
        console.log(err)

        return {status: "ERROR", errorMessage: err}
    }
}

async function setPermissionLevel(adminUserID, targetEmail, permissionLevel, successStatus = (httpStatus) => httpStatus >= 200 && httpStatus < 400){
    try {
        const res = await axios.patch(
            `${testEndpoint}/api/admin/set-permission-level`,
            {email: targetEmail, permissionLevel},
            {
                headers: {
                    Cookie: `token=${GetJWT(adminUserID)}`
                },
                validateStatus: (httpStatus) => successStatus(httpStatus)
            }
        )

        return {status: "SUCCESS", data: res.data, httpStatus: res.status}

    } catch (err) {
        console.log("Error setting permission level " + permissionLevel + " for user " + targetEmail + "\n")
        console.log(err)

        return {status: "ERROR", errorMessage: err}
    }
}

async function getAdminUsers(adminUserID, successStatus = (httpStatus) => httpStatus >= 200 && httpStatus < 400){
    try {
        const res = await axios.get(
            `${testEndpoint}/api/admin/get-admin-users`,
            {
                headers: {
                    Cookie: `token=${GetJWT(adminUserID)}`
                },
                validateStatus: (httpStatus) => successStatus(httpStatus)
            }
        )

        return {status: "SUCCESS", data: res.data, httpStatus: res.status}

    } catch (err) {
        console.log("Error getting admin users\n")
        console.log(err)

        return {status: "ERROR", errorMessage: err}
    }
}

async function clearQueue(adminUserID, locationID, successStatus = (httpStatus) => httpStatus >= 200 && httpStatus < 400){
    try {
        const res = await axios.patch(
            `${testEndpoint}/api/admin/clear-queue`,
            {locationID: locationID},
            {
                headers: {
                    Cookie: `token=${GetJWT(adminUserID)}`
                },
                validateStatus: (httpStatus) => successStatus(httpStatus)
            }
        )

        return {status: "SUCCESS", data: res.data, httpStatus: res.status}

    } catch (err) {
        console.log("Error clearing queue for location " + locationID + "\n")
        console.log(err)

        return {status: "ERROR", errorMessage: err}
    }
}

async function updateLocation(adminUserID, chargingPoint, locationID, wattage, lat, lng, name, noChargers, successStatus = (httpStatus) => httpStatus >= 200 && httpStatus < 400){
    try {
        const res = await axios.patch(
            `${testEndpoint}/api/admin/update-location`,
            {chargingPoint, locationID, wattage, lat, lng, name, noChargers},
            {
                headers: {
                    Cookie: `token=${GetJWT(adminUserID)}`
                },
                validateStatus: (httpStatus) => successStatus(httpStatus)
            }
        )

        return {status: "SUCCESS", data: res.data, httpStatus: res.status}

    } catch (err) {
        console.log("Error updating location " + locationID + "\n")
        console.log(err)

        return {status: "ERROR", errorMessage: err}
    }
}

async function updateChargingPoint(adminUserID, chargingPointID, newStatus, newLocationID, successStatus = (httpStatus) => httpStatus >= 200 && httpStatus < 400){
    try {
        const res = await axios.patch(
            `${testEndpoint}/api/admin/update-charging-point`,
            {chargingPointID: chargingPointID, status: newStatus, locationID: newLocationID},
            {
                headers: {
                    Cookie: `token=${GetJWT(adminUserID)}`
                },
                validateStatus: (httpStatus) => successStatus(httpStatus)
            }
        )

        return {status: "SUCCESS", data: res.data, httpStatus: res.status}

    } catch (err) {
        console.log("Error updating charging point " + chargingPointID + "\n")
        console.log(err)

        return {status: "ERROR", errorMessage: err}
    }
}

async function deleteLocation(adminUserID, locationID, successStatus = (httpStatus) => httpStatus >= 200 && httpStatus < 400){
    try {
        const res = await axios.patch(
            `${testEndpoint}/api/admin/delete-location`,
            {locationID},
            {
                headers: {
                    Cookie: `token=${GetJWT(adminUserID)}`
                },
                validateStatus: (httpStatus) => successStatus(httpStatus)
            }
        )

        return {status: "SUCCESS", data: res.data, httpStatus: res.status}

    } catch (err) {
        console.log("Error deleting location " + locationID + "\n")
        console.log(err)

        return {status: "ERROR", errorMessage: err}
    }
}

async function deleteChargingPoint(adminUserID, chargingPointID, successStatus = (httpStatus) => httpStatus >= 200 && httpStatus < 400){
    try {
        const res = await axios.patch(
            `${testEndpoint}/api/admin/delete-charging-point`,
            {chargingPointID},
            {
                headers: {
                    Cookie: `token=${GetJWT(adminUserID)}`
                },
                validateStatus: (httpStatus) => successStatus(httpStatus)
            }
        )

        return {status: "SUCCESS", data: res.data, httpStatus: res.status}

    } catch (err) {
        console.log("Error deleting charging point " + chargingPointID + "\n")
        console.log(err)

        return {status: "ERROR", errorMessage: err}
    }
}