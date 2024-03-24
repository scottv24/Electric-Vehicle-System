const { AppendTestResults } = require('../testTools')
const { AssertHTTPResponse, AssertUserData, AssertLocationData, AssertChargerData, AssertQueueData, AssertUserChargerData, CompoundAssertion, AssertUserChargerQueueData  } = require('../assertions')

module.exports = { TestUserStatus, TestLocationData, TestChargerData }

async function TestUserStatus(){

    allResults = {name: "User Status Tests", outputText: "", successCount: 0, failureCount: 0}

    allResults.outputText+= "<br><b>Test user 1 status: </b>"
    allResults = AppendTestResults(allResults, await AssertUserData(1, {status: "IDLE"}))

    return allResults
}

async function TestLocationData(){
    allResults = {name: "Location Data Access Tests", outputText: "", successCount: 0, failureCount: 0}

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
    allResults = {name: "Charger Data Access Tests", outputText: "", successCount: 0, failureCount: 0}

    allResults.outputText+= "<br><b>Test charger 1 data access: </b>"
    allResults = AppendTestResults(allResults, await AssertChargerData(1, {
        chargingPointID: 1,
        status: "IDLE",
        locationID: 1,
    }))

    return allResults
}