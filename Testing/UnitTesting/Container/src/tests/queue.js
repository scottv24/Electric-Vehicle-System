const { AppendTestResults, tryJoinQueue, tryLeaveQueue, tryCheckIn, tryCheckOut, tryCancelReservation  } = require('../testTools')
const { AssertHTTPResponse, AssertUserData, AssertLocationData, AssertChargerData, AssertQueueData, AssertUserChargerData, CompoundAssertion, AssertUserChargerQueueData  } = require('../assertions')

module.exports = { TestJoinAndLeaveQueue, TestFillingLocation, TestCheckInAndOut, TestCancelReservation, TestQueueOrdering }

async function TestJoinAndLeaveQueue(){
    allResults = {outputText: "<h3>Test joining and leaving queue</h3>", successCount: 0, failureCount: 0}

    allResults.outputText+= "<br><b>Test user 1 joining queue 5: </b>"
    await tryJoinQueue(1, [5], allResults, async (allResults) => {

        AppendTestResults(allResults, await AssertUserData(1,
            {
                status: "WAITING",
            }))
    })

    allResults.outputText+= "<br><b>Test user 1 leaving queue 5: </b>"
    await tryLeaveQueue(1, [5], allResults, async (allResults) => {
            AppendTestResults(allResults, await AssertUserData(1,
                {
                    status: "IDLE",
                }),
            )
    })

    return allResults
}

async function TestFillingLocation(){
    allResults = {outputText: "<h3>Test filling a location</h3>", successCount: 0, failureCount: 0}

    allResults.outputText+= "<br><b>Test user 1 joining queue 4: </b>"
    await tryJoinQueue(1, [4], allResults, async (allResults) => {
        AppendTestResults(allResults, await AssertUserChargerQueueData(1,
            {
                status: "PENDING",
            },
            {
                locationID: 4,
                status: "RESERVED",
            },
            []))
    })

    allResults.outputText+= "<br><b>Test user 2 joining queue 4: </b>"
    await tryJoinQueue(2, [4], allResults, async (allResults) => {
        AppendTestResults(allResults, await AssertUserChargerQueueData(2,
            {
                status: "PENDING",
            },
            {
                locationID: 4,
                status: "RESERVED",
            },
            []))
    })

    allResults.outputText+= "<br><b>Test user 3 joining queue 4: </b>"
    await tryJoinQueue(3, [4], allResults, async (allResults) => {
        AppendTestResults(allResults, await AssertUserChargerQueueData(3,
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
    })

    allResults.outputText+= "<br><b>Test user 4 joining queue 4: </b>"
    await tryJoinQueue(4, [4], allResults, async (allResults) => {
        AppendTestResults(allResults, await AssertUserChargerQueueData(4,
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
    })

    return allResults
}

async function TestCheckInAndOut(){
    allResults = {outputText: "<h3>Test checking in and out</h3>", successCount: 0, failureCount: 0}

    allResults.outputText+= "<br><b>Test user 1 joining queue 4: </b>"
    await tryJoinQueue(1, [4], allResults, async (allResults) => {
        AppendTestResults(allResults, await AssertUserChargerQueueData(1,
            {
                status: "PENDING",
            },
            {
                locationID: 4,
                status: "RESERVED",
            },
            []))
    })

    allResults.outputText+= "<br><b>Test user 1 checking in: </b>"
    await tryCheckIn(1, allResults, async (allResults) => {
        AppendTestResults(allResults, await AssertUserChargerQueueData(1,
            {
                status: "CHARGING",
            },
            {
                locationID: 4,
                status: "CHARGING",
            },
            []))
    })

    allResults.outputText+= "<br><b>Test user 1 checking out: </b>"
    await tryCheckOut(1, allResults, async (allResults) => {
        AppendTestResults(allResults, await AssertUserChargerQueueData(1,
            {
                status: "IDLE",
            },
            {
                locationID: 4,
                status: "IDLE",
            },
            []))
    })

    return allResults
}

async function TestCancelReservation(){
    allResults = {outputText: "<h3>Test cancelling reservations</h3>", successCount: 0, failureCount: 0}

    let assignedCharger

    allResults.outputText+= "<br><b>Test user 1 joining queue 4: </b>"
    await tryJoinQueue(1, [4], allResults, async (allResults) => {

        let assertionData = await AssertUserChargerQueueData(1,
            {
                status: "PENDING",
            },
            {
                locationID: 4,
                status: "RESERVED",
            },
            [])

        AppendTestResults(allResults, assertionData)

        assignedCharger = assertionData.res[0].data.chargingPointID
    })

    allResults.outputText+= "<br><b>Test user 1 cancelling reservation: </b>"
    await tryCancelReservation(1, allResults, async (allResults) => {
            AppendTestResults(allResults, await CompoundAssertion([
                async () => await AssertUserData(1,
                    {
                        status: "WAITING",
                    }),
                async () => await AssertChargerData(assignedCharger,
                    {
                        locationID: 4,
                        status: "IDLE",
                    }),
                async () => await AssertQueueData(1, [])
            ]))
    })

    return allResults
}

async function TestQueueOrdering(){
    allResults = {outputText: "<h3>Test queue ordering when someone leaves</h3>", successCount: 0, failureCount: 0}

    allResults.outputText+= "<br><b>Test user 1 joining queue 4: </b>"
    await tryJoinQueue(1, [4], allResults, async (allResults) => {
        AppendTestResults(allResults, await AssertUserChargerQueueData(1,
            {
                status: "PENDING",
            },
            {
                locationID: 4,
                status: "RESERVED",
            },
            []))
    })

    allResults.outputText+= "<br><b>Test user 2 joining queue 4: </b>"
    await tryJoinQueue(2, [4], allResults, async (allResults) => {
        AppendTestResults(allResults, await AssertUserChargerQueueData(2,
            {
                status: "PENDING",
            },
            {
                locationID: 4,
                status: "RESERVED",
            },
            []))
    })

    allResults.outputText+= "<br><b>Test user 3 joining queue 4: </b>"
    await tryJoinQueue(3, [4], allResults, async (allResults) => {
        AppendTestResults(allResults, await AssertUserChargerQueueData(3,
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
    })

    allResults.outputText+= "<br><b>Test user 4 joining queue 4: </b>"
    await tryJoinQueue(4, [4], allResults, async (allResults) => {
        AppendTestResults(allResults, await AssertUserChargerQueueData(4,
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
    })

    allResults.outputText+= "<br><b>Test user 3 leaving queue 4: </b>"
    await tryLeaveQueue(3, [4], allResults, async (allResults) => {
        AppendTestResults(allResults, 
            await CompoundAssertion([
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
                }])])
                
            )
    })

    allResults.outputText+= "<br><b>Test user 3 joining queue 4 again: </b>"
    await tryJoinQueue(3, [4], allResults, async (allResults) => {
        AppendTestResults(allResults, await AssertUserChargerQueueData(3,
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
    })

    return allResults
}