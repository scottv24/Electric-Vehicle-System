const { tryRequest } = require('../testTools')
const { AssertHTTPResponse, AssertUserData, AssertLocationData, AssertChargerData, AssertQueueData, AssertAdminUserData, AssertReportData, AssertReportCount,
    AssertUserChargerData, CompoundAssertion, AssertUserChargerQueueData  } = require('../assertions')

const { joinQueue, leaveQueue, checkIn, checkOut, cancelReservation, setPermissionLevel, getAdminUsers, clearQueue, updateLocation, updateChargingPoint,
    deleteLocation, deleteChargingPoint, getLocationData, getChargerData, updateCharger, removeReport, getReportCount, validateReport } = require('../requests')

const {  } = require('../requests')

module.exports = { TestUpdateCharger, TestDeletingReport, TestGettingReportCount, TestValidatingReport }

async function TestUpdateCharger(){

    allResults = {name: "Test updating a charger's status from a report", outputText: "", successCount: 0, failureCount: 0}

    allResults.outputText+= "<br><b>Test reporting a charger as broken, which should log a report: </b>"
    await tryRequest (async() => updateCharger(1, 1, "BROKEN", "It is not charging my car!"), allResults, async () => await AssertReportData(8, [
        {
            reportID: 1,
            chargingPointID: 1,
            message: "It is not charging my car!",
        }
    ]))

    allResults.outputText+= "<br><b>Test reporting a charger as in use, which should automatically update it's status: </b>"
    await tryRequest (async() => updateCharger(1, 2, "CHARGING", ""), allResults, async () => await CompoundAssertion([
        async () => await AssertReportData(8, [{
            reportID: 1,
            chargingPointID: 1,
            message: "It is not charging my car!",
        }]),
        async () => await AssertChargerData(2, {
            chargingPointID: 2,
            locationID: 1,
            status: "CHARGING",
        })
    ]))

    return allResults
}

async function TestDeletingReport(){

    allResults = {name: "Test deleting a report", outputText: "", successCount: 0, failureCount: 0}

    allResults.outputText+= "<br><b>Test reporting a charger as broken, which should log a report: </b>"
    await tryRequest (async() => updateCharger(1, 1, "BROKEN", "It is not charging my car!"), allResults, async () => await AssertReportData(8, [
        {
            reportID: 1,
            chargingPointID: 1,
            message: "It is not charging my car!",
        }
    ]))

    allResults.outputText+= "<br><b>Test deleting a report: </b>"
    await tryRequest (async() => removeReport(8, 1), allResults, async () => await AssertReportData(8, []))

    return allResults
}

async function TestGettingReportCount(){

    allResults = {name: "Test getting report count", outputText: "", successCount: 0, failureCount: 0}

    allResults.outputText+= "<br><b>Test reporting a charger as broken, which should log a report: </b>"
    await tryRequest (async() => updateCharger(1, 1, "BROKEN", "It is not charging my car 1!"), allResults, async () => await AssertReportData(8, [
        {
            reportID: 1,
            chargingPointID: 1,
            message: "It is not charging my car 1!",
        }
    ]))

    allResults.outputText+= "<br><b>Test reporting a charger as broken, which should log a report: </b>"
    await tryRequest (async() => updateCharger(2, 3, "BROKEN", "It is not charging my car 2!"), allResults, async () => await AssertReportData(8, [
        {
            reportID: 1,
            chargingPointID: 1,
            message: "It is not charging my car 1!",
        },
        {
            reportID: 2,
            chargingPointID: 3,
            message: "It is not charging my car 2!",
        }
    ]))

    allResults.outputText+= "<br><b>Test reporting a charger as broken, which should log a report: </b>"
    await tryRequest (async() => updateCharger(4, 5, "BROKEN", "It is not charging my car 3!"), allResults, async () => await AssertReportData(8, [
        {
            reportID: 1,
            chargingPointID: 1,
            message: "It is not charging my car 1!",
        },
        {
            reportID: 2,
            chargingPointID: 3,
            message: "It is not charging my car 2!",
        },
        {
            reportID: 3,
            chargingPointID: 5,
            message: "It is not charging my car 3!",
        }
    ]))

    allResults.outputText+= "<br><b>Test that the report count is 3: </b>"
    await tryRequest (async() => getReportCount(8), allResults, async () => await AssertReportCount(8, 3))

    return allResults
}

async function TestValidatingReport(){

    allResults = {name: "Test deleting a report", outputText: "", successCount: 0, failureCount: 0}

    allResults.outputText+= "<br><b>Test reporting a charger as broken, which should log a report: </b>"
    await tryRequest (async() => updateCharger(1, 1, "BROKEN", "It is not charging my car!"), allResults, async () => await CompoundAssertion ([
        async () => await AssertReportData(8, [
        {
            reportID: 1,
            chargingPointID: 1,
            message: "It is not charging my car!",
        }]),
        async () => await AssertChargerData(1, {
            locationID: 1,
            status: "IDLE",
        })
    ]))

    allResults.outputText+= "<br><b>Test validating the report, which should update the charger's state to broken: </b>"
    await tryRequest (async() => validateReport(8, 1), allResults, async () => await CompoundAssertion([
        async () => await AssertReportData(8, []),
        async () => await AssertChargerData(1, {
            locationID: 1,
            status: "BROKEN",
        })
    ]))

    return allResults
}