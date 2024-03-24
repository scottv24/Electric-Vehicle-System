const { AppendTestResults } = require('../testTools')
const { AssertHTTPResponse, AssertUserData, AssertLocationData, AssertChargerData, AssertQueueData, AssertUserChargerData, CompoundAssertion, AssertUserChargerQueueData  } = require('../assertions')

module.exports = { TestUserStatus, TestLocationData, TestChargerData }

async function TestUserStatus(){

    allResults = {outputText: "<h3>User Status Tests</h3>", successCount: 0, failureCount: 0}

    allResults.outputText+= "<br><b>Test user 1 status: </b>"
    allResults = AppendTestResults(allResults, await AssertUserData(1, {status: "IDLE"}))

    return allResults
}

async function TestLocationData(){
    allResults = {outputText: "<h3>Location Data Access Tests</h3>", successCount: 0, failureCount: 0}

    allResults.outputText+= "<br><b>Test location 1 data access: </b>"
    allResults = AppendTestResults(allResults, await AssertLocationData(1, {
        locationID: 1,
        name: 'Test Location 1',
        wattage: '10',
        lat: '1',
        lng: '2',
    }))

    return allResults
}

async function TestChargerData(){
    allResults = {outputText: "<h3>Charger Data Access Tests</h3>", successCount: 0, failureCount: 0}

    allResults.outputText+= "<br><b>Test charger 1 data access: </b>"
    allResults = AppendTestResults(allResults, await AssertChargerData(1, {
        chargingPointID: 1,
        status: "IDLE",
        locationID: 1,
    }))

    return allResults
}