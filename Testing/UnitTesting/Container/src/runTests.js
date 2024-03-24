const { glob } = require('glob')
const path = require('path')
const mariadb = require('mariadb');
const fs = require('fs').promises

const { testRequest } = require('./requests')

module.exports = { runAllTests, getTestResults }

let testResults

async function runAllTests() {
    
    while(true)
    {
        if(await testRequest())
        {
            break;
        }
        else
        {
            console.log("Initial backend connection failed, retrying in 1 second...")

            await new Promise(r => setTimeout(r, 1000));
        }

    }

    console.log("Loading tests...")
    const testFiles = await glob(path.join(__dirname, '/tests/') + '**/*.js')
    
    let testFunctions = []
    testFiles.forEach((file) => Object.entries(require(file.replace('.js', ''))).map((func) => testFunctions.push(func[1])))

    console.log("Successfully loaded " + testFiles.length + " test files containing " + testFunctions.length + " tests: ")
    console.log(testFunctions)
    console.log("Running tests...")

    successCount = 0
    failureCount = 0
    outputText = ""

    console.log("Resetting database before testing...")
    await resetDatabase()
    console.log("Database reset complete")
    
    for(let i = 0; i < testFunctions.length; i++)
    {
        console.log("Running test " + (i + 1) + "/" + testFunctions.length + "...")
        try
        {
        result = await testFunctions[i]()

        if(result.failureCount == 0)
        {
            successCount++
        }
        else
        {
            failureCount++
        }

        outputText+= "<h3>" + result.name + ": " + (result.failureCount == 0 ? "PASS" : "FAIL") + "</h3>" + result.outputText + "<br><br>"
        console.log("Test complete")
        }
        catch(err)
        {
            console.log("Error running test:\n")
            console.log(err)
        }

        console.log("Cleaning up database...")
        await resetDatabase()
        console.log("Database cleanup complete")
    }

    console.log("Tests complete!")
    testResults = {successCount, failureCount, outputText}
}

function getTestResults()
{
    return testResults
}

const connectionPool = mariadb.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 1,
    multipleStatements: true 
});

let databaseSQL

async function resetDatabase()
{
    try{
        if(databaseSQL == undefined)
        {
            databaseSQL = await fs.readFile('/init-db.sql', 'utf8')

            //Remove unnecesarry lines and statements
            databaseSQL = databaseSQL.split(/\r?\n/).filter((line) => !line.includes("--"))
            .reduce((aggregation, line) => aggregation + line, "").split(';').filter((statement) => statement.includes("INSERT") || statement.includes("AUTO_INCREMENT"))
            .reduce((aggregation, line) => aggregation + line + ';', "")
        }

        const databaseConnection = await connectionPool.getConnection()
        
        //Get list of tables to be cleared
        const result = await databaseConnection.query("SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = '" + process.env.DB_NAME + "';")
        
        //Remove foreign key constraints
        let allStatements = "SET FOREIGN_KEY_CHECKS=0;"
        
        //Aggregate statements to clear all tables
        for(let i = 0; i < result.length; i++)
        {
            allStatements+= "DELETE FROM " + process.env.DB_NAME + "." + result[i].TABLE_NAME + ";"
        }
        
        //Combine statements with those required to reinsert initial data and enabling of foreign key constraints
        allStatements+= databaseSQL + "SET FOREIGN_KEY_CHECKS=1;"

        await databaseConnection.query(allStatements)
        
        databaseConnection.end()
    }
    catch(err)
    {
        console.log("Error during database reset:\n")
        console.log(err)
    }
}