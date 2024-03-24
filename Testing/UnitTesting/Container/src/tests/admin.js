const { tryRequest } = require('../testTools')
const { AssertHTTPResponse, AssertUserData, AssertLocationData, AssertChargerData, AssertQueueData, AssertAdminUserData,
    AssertUserChargerData, CompoundAssertion, AssertUserChargerQueueData  } = require('../assertions')

const { joinQueue, leaveQueue, checkIn, checkOut, cancelReservation,
        setPermissionLevel, getAdminUsers, clearQueue, updateLocation, updateChargingPoint, deleteLocation, deleteChargingPoint, getLocationData, getChargerData } = require('../requests')

module.exports = { TestSetPermissionLevel, TestClearQueue, TestUpdateLocation, TestUpdateCharger, TestDeletingLocation, TestDeletingCharger}

async function TestSetPermissionLevel(){
    allResults = {name: "Test setting user permission level", outputText: "", successCount: 0, failureCount: 0}

    allResults.outputText+= "<br><b>Test setting user 1 to admin: </b>"
    await tryRequest (async() => setPermissionLevel(8, "test-user-1", "ADMIN"), allResults, async () => await AssertAdminUserData(8,
        [
            {
                email: "test-admin-1"
            },
            {
                email: "test-admin-2"
            },
            {
                email: "test-superadmin-1"
            },
            {
                email: "test-user-1"
            },
        ]))

    allResults.outputText+= "<br><b>Test setting user 1 to user: </b>"
    await tryRequest (async() => setPermissionLevel(8, "test-user-1", "USER"), allResults, async () => await AssertAdminUserData(8,
        [
            {
                email: "test-admin-1"
            },
            {
                email: "test-admin-2"
            },
            {
                email: "test-superadmin-1"
            },
        ]))

    return allResults
}

async function TestClearQueue(){
    allResults = {name: "Test clearing queue", outputText: "", successCount: 0, failureCount: 0}

    allResults.outputText+= "<br><b>Test user 1 joining queue 5: </b>"
    await tryRequest(async() => joinQueue(1, [5]), allResults, async () => await AssertUserChargerQueueData(1,
        {
            status: "WAITING",
        },
        {},
        [{
            position: '1',
            locationID: 5,
            name: 'Test Location 5',
            wattage: '50'
        }]))

    allResults.outputText+= "<br><b>Test user 2 joining queue 5: </b>"
    await tryRequest(async() => joinQueue(2, [5]), allResults, async () => await AssertUserChargerQueueData(2,
        {
            status: "WAITING",
        },
        {},
        [{
            position: '2',
            locationID: 5,
            name: 'Test Location 5',
            wattage: '50'
        }]))

    allResults.outputText+= "<br><b>Test user 3 joining queue 5: </b>"
    await tryRequest(async() => joinQueue(3, [5]), allResults, async () => await AssertUserChargerQueueData(3,
        {
            status: "WAITING",
        },
        {},
        [{
            position: '3',
            locationID: 5,
            name: 'Test Location 5',
            wattage: '50'
        }]))

    allResults.outputText+= "<br><b>Test clearing queue: </b>"
    await tryRequest(async() => clearQueue(8, 5), allResults, async () => await CompoundAssertion([
        async () => await AssertUserChargerQueueData(1,
            {
                status: "IDLE",
            },
            {},
            []),
        async () => await AssertUserChargerQueueData(2,
            {
                status: "IDLE",
            },
            {},
            []),
        async () => await AssertUserChargerQueueData(3,
            {
                status: "IDLE",
            },
            {},
            []),
        ]))

    return allResults
}

async function TestUpdateLocation(){
    allResults = {name: "Test updating location", outputText: "", successCount: 0, failureCount: 0}

    allResults.outputText+= "<br><b>Test adding new location: </b>"
    await tryRequest (async() => updateLocation(8, [], undefined, 30, 11, 12, "Newly added location", 0), allResults, async () => await AssertLocationData(6,
        {
            locationID: 6,
            name: "Newly added location",
            wattage: "30",
            lat: "11",
            lng: "12",
        }))

    allResults.outputText+= "<br><b>Test updating the new location: </b>"
    await tryRequest (async() => updateLocation(8, [], 6, 31, 13, 14, "Newly added location updated", 0), allResults, async () => await AssertLocationData(6,
        {
            locationID: 6,
            name: "Newly added location updated",
            wattage: "31",
            lat: "13",
            lng: "14",
        }))

    return allResults
}

async function TestUpdateCharger(){
    allResults = {name: "Test updating charger", outputText: "", successCount: 0, failureCount: 0}

    allResults.outputText+= "<br><b>Test adding new charger to location 5: </b>"
    await tryRequest (async() => updateChargingPoint(8, undefined, "IDLE", 5), allResults, async () => await AssertChargerData(15,
        {
            chargingPointID: 15,
            status: "IDLE",
            locationID: 5,
        }))

    allResults.outputText+= "<br><b>Test updating the new charger to be broken: </b>"
    await tryRequest (async() => updateChargingPoint(8, 15, "BROKEN", 5), allResults, async () => await AssertChargerData(15,
        {
            chargingPointID: 15,
            status: "BROKEN",
            locationID: 5,
        }))

    return allResults
}

async function TestDeletingLocation(){
    allResults = {name: "Test deleting location", outputText: "", successCount: 0, failureCount: 0}

    allResults.outputText+= "<br><b>Test adding new location: </b>"
    await tryRequest (async() => updateLocation(8, [], undefined, 30, 11, 12, "Newly added location", 0), allResults, async () => await AssertLocationData(6,
        {
            locationID: 6,
            name: "Newly added location",
            wattage: "30",
            lat: "11",
            lng: "12",
        }))

        allResults.outputText+= "<br><b>Test deleting the new location, then trying to access it: </b>"
        await tryRequest (async() => deleteLocation(8, 6), allResults, async () => await AssertHTTPResponse(async () => await getLocationData(6, (httpStatus) => httpStatus == 404), 404))

    return allResults
}

async function TestDeletingCharger(){
    allResults = {name: "Test deleting charger", outputText: "", successCount: 0, failureCount: 0}

    allResults.outputText+= "<br><b>Test adding new charger to location 5: </b>"
    await tryRequest (async() => updateChargingPoint(8, undefined, "IDLE", 5), allResults, async () => await AssertChargerData(15,
        {
            chargingPointID: 15,
            status: "IDLE",
            locationID: 5,
        }))

    allResults.outputText+= "<br><b>Test deleting the new charger, then trying to access it: </b>"
    await tryRequest (async() => deleteChargingPoint(8, 15), allResults, async () => await AssertChargerData(15, undefined))

    return allResults
}