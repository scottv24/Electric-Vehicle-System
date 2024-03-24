const { tryRequest } = require('../testTools')
const { AssertHTTPResponse, AssertUserData, AssertLocationData, AssertChargerData, AssertQueueData, AssertUserChargerData, CompoundAssertion, AssertUserChargerQueueData  } = require('../assertions')
const { joinQueue, leaveQueue, checkIn, checkOut, cancelReservation, getUserData } = require('../requests')

module.exports = { TestJoinAndLeaveQueue, TestFillingLocation, TestCheckInAndOut, TestCancelReservation, TestQueueOrdering }

async function TestJoinAndLeaveQueue(){
    allResults = {name: "Test joining and leaving queue", outputText: "", successCount: 0, failureCount: 0}

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

    allResults.outputText+= "<br><b>Test user 1 leaving queue 5: </b>"
    await tryRequest(async() => leaveQueue(1, [5]), allResults, async () => await AssertUserChargerQueueData(1,
        {
            status: "IDLE",
        },
        {},
        []))

    return allResults
}

async function TestFillingLocation(){
    allResults = {name: "Test filling a location", outputText: "", successCount: 0, failureCount: 0}

    allResults.outputText+= "<br><b>Test user 1 joining queue 4: </b>"
    await tryRequest(async() => joinQueue(1, [4]), allResults, async () => await AssertUserChargerQueueData(1,
        {
            status: "PENDING",
        },
        {
            locationID: 4,
            status: "RESERVED",
        },
        []))

    allResults.outputText+= "<br><b>Test user 2 joining queue 4: </b>"
    await tryRequest(async() => joinQueue(2, [4]), allResults, async () => await AssertUserChargerQueueData(2,
        {
            status: "PENDING",
        },
        {
            locationID: 4,
            status: "RESERVED",
        },
        []))

    allResults.outputText+= "<br><b>Test user 3 joining queue 4: </b>"
    await tryRequest(async() => joinQueue(3, [4]), allResults, async () => await AssertUserChargerQueueData(3,
        {
            status: "WAITING",
        },
        {},
        [{
            position: '1',
            locationID: 4,
            name: 'Test Location 4',
            wattage: '20'
        }]))

    allResults.outputText+= "<br><b>Test user 4 joining queue 4: </b>"
    await tryRequest(async() => joinQueue(4, [4]), allResults, async () => await AssertUserChargerQueueData(4,
        {
            status: "WAITING",
        },
        {},
        [{
            position: '2',
            locationID: 4,
            name: 'Test Location 4',
            wattage: '20'
        }]))

    return allResults
}

async function TestCheckInAndOut(){
    allResults = {name: "Test checking in and out", outputText: "", successCount: 0, failureCount: 0}

    let chargerID

    allResults.outputText+= "<br><b>Test user 1 joining queue 4: </b>"
    await tryRequest(async() => joinQueue(1, [4]), allResults, async () => { let assertion = await AssertUserChargerQueueData(1,
        {
            status: "PENDING",
        },
        {
            locationID: 4,
            status: "RESERVED",
        },
        []); chargerID = assertion.res[0].data.chargingPointID; return assertion})

    allResults.outputText+= "<br><b>Test user 1 checking in: </b>"
    await tryRequest(async() => checkIn(1), allResults, async () => await AssertUserChargerQueueData(1,
        {
            status: "CHARGING",
        },
        {
            locationID: 4,
            status: "CHARGING",
        },
        []))

    allResults.outputText+= "<br><b>Test user 1 checking out: </b>"
    await tryRequest(async() => checkOut(1), allResults, async () => await CompoundAssertion([
        async () => await AssertUserData(1,
            {
            status: "IDLE",
            }),
        async () => await AssertChargerData(chargerID,
            {
                locationID: 4,
                status: "IDLE",
            }),
        async () => await AssertQueueData(1,[]),
    ]))

    return allResults
}

async function TestCancelReservation(){
    allResults = {name: "Test cancelling reservations", outputText: "", successCount: 0, failureCount: 0}

    allResults.outputText+= "<br><b>Test user 1 joining queue 4: </b>"
    await tryRequest(async() => joinQueue(1, [4]), allResults, async () => await AssertUserChargerQueueData(1,
        {
            status: "PENDING",
        },
        {
            locationID: 4,
            status: "RESERVED",
        },
        []))

    const chargerID =(await getUserData(1)).data.chargingPointID

    allResults.outputText+= "<br><b>Test user 1 cancelling reservation: </b>"
    await tryRequest(async() => cancelReservation(1), allResults, async () => await CompoundAssertion([
        async () => await AssertUserData(1,
            {
                status: "WAITING",
            }),
        async () => await AssertChargerData(chargerID,
            {
                locationID: 4,
                status: "IDLE",
            }),
        async () => await AssertQueueData(1, [])
        ]))

    return allResults
}

async function TestQueueOrdering(){
    allResults = {name: "Test queue ordering when someone leaves", outputText: "", successCount: 0, failureCount: 0}

    allResults.outputText+= "<br><b>Test user 1 joining queue 4: </b>"
    await tryRequest(async() => joinQueue(1, [4]), allResults, async () => await AssertUserChargerQueueData(1,
        {
            status: "PENDING",
        },
        {
            locationID: 4,
            status: "RESERVED",
        },
        []))

    allResults.outputText+= "<br><b>Test user 2 joining queue 4: </b>"
    await tryRequest(async() => joinQueue(2, [4]), allResults, async () => await AssertUserChargerQueueData(2,
        {
            status: "PENDING",
        },
        {
            locationID: 4,
            status: "RESERVED",
        },
        []))

    allResults.outputText+= "<br><b>Test user 3 joining queue 4: </b>"
    await tryRequest(async() => joinQueue(3, [4]), allResults, async () => await AssertUserChargerQueueData(3,
        {
            status: "WAITING",
        },
        {},
        [{
            position: '1',
            locationID: 4,
            name: 'Test Location 4',
            wattage: '20'
        }]))

    allResults.outputText+= "<br><b>Test user 4 joining queue 4: </b>"
    await tryRequest(async() => joinQueue(4, [4]), allResults, async () => await AssertUserChargerQueueData(4,
        {
            status: "WAITING",
        },
        {},
        [{
            position: '2',
            locationID: 4,
            name: 'Test Location 4',
            wattage: '20'
        }]))

    allResults.outputText+= "<br><b>Test user 3 leaving queue 4: </b>"
    await tryRequest(async() => leaveQueue(3, [4]), allResults, async () => await CompoundAssertion([
        //Assert user 3 has left queue
        async () => await AssertUserChargerQueueData(3,
        {
            status: "IDLE",
        },
        {},
        []),
        //Assert that user 4 has moved into position 1 in queue
        async () => await AssertUserChargerQueueData(4,
        {
            status: "WAITING",
        },
        {},
        [{
            position: '1',
            locationID: 4,
            name: 'Test Location 4',
            wattage: '20'
        }])]))

    allResults.outputText+= "<br><b>Test user 3 joining queue 4 again: </b>"
    await tryRequest(async() => joinQueue(3, [4]), allResults, async () => await AssertUserChargerQueueData(3,
        {
            status: "WAITING",
        },
        {},
        [{
            position: '2',
            locationID: 4,
            name: 'Test Location 4',
            wattage: '20'
        }]))

    return allResults
}