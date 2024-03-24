const { GetJWT } = require('../authentication')
const { verifyUser } = require('../requests')
const { AppendTestResults } = require('../testTools')
const { AssertHTTPResponse, AssertUserData, AssertLocationData, AssertChargerData, AssertQueueData, AssertUserChargerData, CompoundAssertion, AssertUserChargerQueueData  } = require('../assertions')

module.exports = { TestLoginVerification }

async function TestLoginVerification(){

    allResults = {name: "Test Login Verification", outputText: "", successCount: 0, failureCount: 0}

    allResults.outputText+= "<br><b>Test user verification with valid JWT: </b>"
    allResults = AppendTestResults(allResults, await AssertHTTPResponse(async () => await verifyUser(1, undefined, (httpStatus) => httpStatus == 302), 302))

    allResults.outputText+= "<br><b>Test user verification with invalid JWT: </b>"
    allResults = AppendTestResults(allResults, await AssertHTTPResponse(async () => await verifyUser(1, "123", (httpStatus) => httpStatus == 401), 401))
    
    allResults.outputText+= "<br><b>Test user verification with expired JWT: </b>"
    const expiredToken = GetJWT(1, "1s")
    await new Promise(r => setTimeout(r, 1000));
    allResults = AppendTestResults(allResults, await AssertHTTPResponse(async () => await verifyUser(1, expiredToken, (httpStatus) => httpStatus == 401), 401))

    return allResults
}