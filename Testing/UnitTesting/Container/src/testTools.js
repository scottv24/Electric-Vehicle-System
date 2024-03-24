const { joinQueue, leaveQueue, checkIn, checkOut, cancelReservation } = require('./requests')

module.exports = { AppendTestResults, tryJoinQueue, tryLeaveQueue, tryCheckIn, tryCheckOut, tryCancelReservation }

function AppendTestResults(allResults, newResult)
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

    return allResults
}

async function tryJoinQueue(userID, locationIDs, allResults, next)
{
    const joinQueueRes = await joinQueue(userID, locationIDs)

    if(joinQueueRes.status == "ERROR")
    {
        allResults.failureCount++

        allResults.outputText+= "FAIL"
        allResults.outputText+= "<br>Error joining queue: " + joinQueueRes.errorMessage + "<br>"
    }
    
    return await next(allResults)
}

async function tryLeaveQueue(userID, locationIDs, allResults, next)
{
    const leaveQueueRes = await leaveQueue(userID, locationIDs)

    if(leaveQueueRes.status == "ERROR")
    {
        allResults.failureCount++

        allResults.outputText+= "FAIL"
        allResults.outputText+= "<br>Error leaving queue: " + leaveQueueRes.errorMessage + "<br>"
    }
    
    return await next(allResults)
}

async function tryCheckIn(userID, allResults, next)
{
    const checkInRes = await checkIn(userID)

    if(checkInRes.status == "ERROR")
    {
        allResults.failureCount++

        allResults.outputText+= "FAIL"
        allResults.outputText+= "<br>Error checking in: " + checkInRes.errorMessage + "<br>"
    }
    
    return await next(allResults)
}

async function tryCheckOut(userID, allResults, next)
{
    const checkOutRes = await checkOut(userID)

    if(checkOutRes.status == "ERROR")
    {
        allResults.failureCount++

        allResults.outputText+= "FAIL"
        allResults.outputText+= "<br>Error checking out: " + checkOutRes.errorMessage + "<br>"
    }
    
    return await next(allResults)
}

async function tryCancelReservation(userID, allResults, next)
{
    const cancelReservationRes = await cancelReservation(userID)

    if(cancelReservationRes.status == "ERROR")
    {
        allResults.failureCount++

        allResults.outputText+= "FAIL"
        allResults.outputText+= "<br>Error checking out: " + cancelReservationRes.errorMessage + "<br>"
    }

    return await next(allResults)
}