const { joinQueue, leaveQueue, checkIn, checkOut, cancelReservation,
    setPermissionLevel, getAdminUsers, clearQueue, updateLocation, updateChargingPoint, deleteLocation, deleteChargingPoint } = require('./requests')

module.exports = { AppendTestResults, tryRequest }

function AppendTestResults(allResults, newResult)
{
    if(newResult.testedReq == undefined || newResult.testedReq.status == "SUCCESS")
    {
        if(newResult.passed)
        {
            allResults.outputText+= "PASS"
            allResults.successCount++
        }
        else
        {
            allResults.outputText+= "FAIL"
            allResults.failureCount++
        }

        allResults.outputText+= "<br>" + newResult.outputText
    }
    else
    {
        allResults.outputText+= "FAIL<br>" + newResult.testedReq.errorMessage + "<br>"
        allResults.failureCount++
    }

    return allResults
}

async function tryRequest(req, allResults, assertion)
{
    const testedReq = await req()

    let assertionResponse = await assertion()
    assertionResponse.testedReq = testedReq

    AppendTestResults(allResults, assertionResponse)
}