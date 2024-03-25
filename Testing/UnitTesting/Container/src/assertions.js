const { getUserData, getLocationData, getAllChargerData, getChargerData, getQueueData, getAdminUsers, getReports, getReportCount } = require('./requests')

module.exports = { AssertHTTPResponse, AssertUserData, AssertLocationData, AssertChargerData, AssertQueueData, AssertAdminUserData, AssertReportData, AssertReportCount,
    AssertUserChargerData, CompoundAssertion, AssertUserChargerQueueData }

function EvaluateExpectedResults(actual, expected)
{
    if(expected === actual)
    {
        return true
    }

    passed = true

    Object.keys(expected).forEach((field) => {

        if((actual[field] == undefined) || (expected[field] != actual[field]))
        {
            passed = false
        }

    })

    return passed
}

function SelectObjectFields(targetFields, input)
{
    if(!targetFields)
    {
        return undefined
    }

    let outputObject = {}

    Object.keys(targetFields).forEach((field) => {

        try
        {
            outputObject[field] = input[field]
        }
        catch(err)
        {

        }
    })

    return outputObject
}

async function AssertHTTPResponse(request, expectedStatus)
{
    let outputText = "<b>Assert HTTP status: </b>"

    let passed = false

    try
    {
        res = await request()

        if(res.status == "SUCCESS" && res.httpStatus == expectedStatus)
        {
            passed = true

            outputText+= "Success"
        }
        else
        {
            outputText+= "Failure"
        }

        outputText+= "<br>Expected HTTP status: " + expectedStatus + "<br>Actual HTTP status: " + res.httpStatus + "<br>"

        if(res.status == "ERROR")
        {
            outputText+= res.errorMessage + "<br>"
        }
    }
    catch(err)
    {
        console.log("Failure in AssertHTTPResponse due to error\n")
        console.log(err)

        outputText+= "Failure due to error<br>" + err + "<br>"
    }

    return {passed, outputText, res: [res]}
}

async function AssertUserData(userID, expected){
    let outputText = "<b>Assert user " + userID + " data: </b>"

    let passed = false

    let res

    try {
        res = await getUserData(userID)

        if(res.status == "SUCCESS" && EvaluateExpectedResults(res.data, expected))
        {
            passed = true

            outputText+= "Success"
        }
        else
        {
            outputText+= "Failure"
        }

        outputText+= "<br>Expected user data: " + JSON.stringify(expected) + "<br>Actual user data: " + JSON.stringify(SelectObjectFields(expected, res.data)) + "<br>"

        if(res.status == "ERROR")
        {
            outputText+= res.errorMessage + "<br>"
        }

    } catch (err) {
        console.log("Failure in AssertUserData due to error\n")
        console.log(err)

        outputText+= "Failure due to error<br>" + err + "<br>"
    }

    return {passed, outputText, res: [res]}
}

async function AssertLocationData(locationID, expected){
    let outputText = "<b>Assert location " + locationID + " data: </b>"

    let passed = false

    let res

    try {
        res = await getLocationData(locationID)

        if(res.status == "SUCCESS" && EvaluateExpectedResults(res.data.location, expected))
        {
            passed = true

            outputText+= "Success"
        }
        else
        {
            outputText+= "Failure"
        }

        outputText+= "<br>Expected location data: " + JSON.stringify(expected) + "<br>Actual location data: " + JSON.stringify(SelectObjectFields(expected, res.data.location)) + "<br>"

        if(res.status == "ERROR")
        {
            outputText+= res.errorMessage + "<br>"
        }

    } catch (err) {
        console.log("Failure in AssertLocationData due to error\n")
        console.log(err)

        outputText+= "Failure due to error<br>" + err + "<br>"
    }

    return {passed, outputText, res: [res]}
}

async function AssertChargerData(chargerID, expected){
    let outputText = "<b>Assert charger " + chargerID + " data: </b>"

    let passed = false

    let res

    try {
        res = await getChargerData(chargerID)

        if(res.status == "SUCCESS" && EvaluateExpectedResults(res.data, expected))
        {
            passed = true

            outputText+= "Success"
        }
        else
        {
            outputText+= "Failure"
        }

        outputText+= "<br>Expected charger data: " + JSON.stringify(expected) + "<br>Actual charger data: " + JSON.stringify(SelectObjectFields(expected, res.data)) + "<br>"

        if(res.status == "ERROR")
        {
            outputText+= res.errorMessage + "<br>"
        }

    } catch (err) {
        console.log("Failure in AssertChargerData due to error\n")
        console.log(err)

        outputText+= "Failure due to error<br>" + err + "<br>"
    }

    return {passed, outputText, res: [res]}
}

async function AssertQueueData(userID, expected){
    let outputText = "<b>Assert queue data of user " + userID + ": </b>"

    let passed = false

    let res

    try {
        res = await getQueueData(userID)

        expected = expected.sort((a, b) => a.locationID > b.locationID)
        res.data.queues = res.data.queues.sort((a, b) => a.locationID > b.locationID)

        if(res.status == "SUCCESS" && expected.length == res.data.queues.length && 
        (expected.length == 0 || expected.map((exp, i) => EvaluateExpectedResults(res.data.queues[i], exp)).reduce((allTrue, current) => allTrue && current, true)))
        {
            passed = true

            outputText+= "Success"
        }
        else
        {
            outputText+= "Failure"
        }

        const formattedQueues = res.data.queues.map((queue, i) => i < expected.length ? SelectObjectFields(expected[i], queue) : queue)

        const expectedString = expected.length == 0 ? "Empty" : JSON.stringify(expected)
        const actualString = formattedQueues.length == 0 ? "Empty" : JSON.stringify(formattedQueues)

        outputText+= "<br>Expected queue data: " + expectedString + "<br>Actual queue data: " + actualString + "<br>"

        if(res.status == "ERROR")
        {
            outputText+= res.errorMessage + "<br>"
        }

    } catch (err) {
        console.log("Failure in AssertQueueData due to error\n")
        console.log(err)

        outputText+= "Failure due to error<br>" + err + "<br>"
    }

    return {passed, outputText, res: [res]}
}

async function AssertAdminUserData(adminUserID, expected){
    let outputText = "<b>Assert admin user data: </b>"

    let passed = false

    let res

    try {
        res = await getAdminUsers(adminUserID)

        res.data.admins = res.data.admins.sort((a, b) => a.email.localeCompare(b.email))
        expected = expected.sort((a, b) => a.email.localeCompare(b.email))

        if(res.status == "SUCCESS" && expected.length == res.data.admins.length && 
        (expected.length == 0 || expected.map((exp, i) => EvaluateExpectedResults(res.data.admins[i], exp)).reduce((allTrue, current) => allTrue && current, true)))
        {
            passed = true

            outputText+= "Success"
        }
        else
        {
            outputText+= "Failure"
        }

        const formattedAdmins = expected.map((exp, i) => SelectObjectFields(exp, res.data.admins[i]))

        const expectedString = expected.length == 0 ? "Empty" : JSON.stringify(expected)
        const actualString = formattedAdmins.length == 0 ? "Empty" : JSON.stringify(formattedAdmins)

        outputText+= "<br>Expected admin data: " + expectedString + "<br>Actual admin data: " + actualString + "<br>"

        if(res.status == "ERROR")
        {
            outputText+= res.errorMessage + "<br>"
        }

    } catch (err) {
        console.log("Failure in AssertAdminUserData due to error\n")
        console.log(err)

        outputText+= "Failure due to error<br>" + err + "<br>"
    }

    return {passed, outputText, res: [res]}
}

async function AssertReportData(adminUserID, expected){
    let outputText = "<b>Assert report data: </b>"

    let passed = false

    let res

    try {
        res = await getReports(adminUserID)

        expected = expected.sort((a, b) => a.locationID > b.locationID)
        res.data.report = res.data.report.sort((a, b) => a.locationID > b.locationID)

        if(res.status == "SUCCESS" && expected.length == res.data.report.length && 
        (expected.length == 0 || expected.map((exp, i) => EvaluateExpectedResults(res.data.report[i], exp)).reduce((allTrue, current) => allTrue && current, true)))
        {
            passed = true

            outputText+= "Success"
        }
        else
        {
            outputText+= "Failure"
        }

        const formattedReports = res.data.report.map((report, i) => i < expected.length ? SelectObjectFields(expected[i], report) : report)

        const expectedString = expected.length == 0 ? "Empty" : JSON.stringify(expected)
        const actualString = formattedReports.length == 0 ? "Empty" : JSON.stringify(formattedReports)

        outputText+= "<br>Expected report data: " + expectedString + "<br>Actual report data: " + actualString + "<br>"

        if(res.status == "ERROR")
        {
            outputText+= res.errorMessage + "<br>"
        }

    } catch (err) {
        console.log("Failure in AssertReportData due to error\n")
        console.log(err)

        outputText+= "Failure due to error<br>" + err + "<br>"
    }

    return {passed, outputText, res: [res]}
}

async function AssertReportCount(adminUserID, expected){
    let outputText = "<b>Assert report count: </b>"

    let passed = false

    let res

    try {
        res = await getReportCount(adminUserID)

        if(res.status == "SUCCESS" && expected == res.data.count)
        {
            passed = true

            outputText+= "Success"
        }
        else
        {
            outputText+= "Failure"
        }

        outputText+= "<br>Expected report count: " + expected + "<br>Actual report count: " + res.data.count + "<br>"

        if(res.status == "ERROR")
        {
            outputText+= res.errorMessage + "<br>"
        }

    } catch (err) {
        console.log("Failure in AssertReportCount due to error\n")
        console.log(err)

        outputText+= "Failure due to error<br>" + err + "<br>"
    }

    return {passed, outputText, res: [res]}
}

async function AssertUserChargerData(userID, userExpected, chargerExpected){

    let passed = false

    let userDataAssertion = await AssertUserData(userID, userExpected)

    let results = userDataAssertion.res

    let outputText = userDataAssertion.outputText

    if(userDataAssertion.passed)
    {
        if(userDataAssertion.res[0].data.chargingPointID)
        {
            let chargerDataAssertion = await AssertChargerData(userDataAssertion.res[0].data.chargingPointID, chargerExpected)

            results = results.concat(chargerDataAssertion.res)

            outputText+= chargerDataAssertion.outputText

            passed = chargerDataAssertion.passed
        }
        else
        {
            passed = true
        }
    }


    return {passed, outputText, res: results}
}

async function CompoundAssertion(assertions)
{
    passed = true

    let assertionOutputText = ""

    res = []

    for(let i = 0; i < assertions.length; i++)
    {
        const assertionData = await assertions[i]()

        passed = passed && assertionData.passed
        assertionOutputText+= assertionData.outputText

        res = res.concat(assertionData.res)
    }

    return {passed, outputText: assertionOutputText, res}
}

async function AssertUserChargerQueueData(userID, userExpected, chargerExpected, queueExpected){

    return await CompoundAssertion([async () => await AssertUserChargerData(userID, userExpected, chargerExpected), async () => await AssertQueueData(userID, queueExpected)])
}