const express = require('express');
const app = express();

const { runAllTests, getTestResults } = require('./runTests')

var hostport = process.env.HOST_PORT;

if(hostport == undefined)
{
    hostport = "3003"
}

app.get('*', async function (req, res)
{
    let testResults = getTestResults()

    if(testResults)
    {
        let formattedOutput = "<h1>Test Results</h1><br><h2>Total Tests Passed: " + testResults.successCount + "<br>Total Tests Failed: " + testResults.failureCount + "</h2><br>" + testResults.outputText + "<br>"

        res.send( formattedOutput );
    }
    else
    {
        res.send( "Running tests (refresh page for update)..." );
    }
});

app.listen(process.env.HOST_PORT, () => console.log('Server running on port ' + process.env.HOST_PORT));

runAllTests()