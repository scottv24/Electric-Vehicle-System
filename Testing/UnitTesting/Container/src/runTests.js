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

    for(let i = 0; i < testFunctions.length; i++)
    {
        await resetDatabase()

        result = await testFunctions[i]()

        successCount+= result.successCount
        failureCount+= result.failureCount

        outputText+= result.outputText + "<br><br>"
    }

    console.log("Tests complete!")

    testResults = {successCount, failureCount, outputText}
}

function getTestResults()
{
    return testResults
}

async function resetDatabase()
{
    try{
        var sql = await fs.readFile('/init-db.sql', 'utf8')

        let sqlStatements = sql.split(/\r?\n/).filter((line) => !line.includes("--")).reduce((aggregation, line) => aggregation + line, "").split(';')

        const connectionPool = mariadb.createPool({
            host: process.env.DB_HOST, 
            user: process.env.DB_USER, 
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            connectionLimit: 1
        });

        const connection = await connectionPool.getConnection()

        const result = await connection.query("SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = '" + process.env.DB_NAME + "';")
        
        await connection.query("SET FOREIGN_KEY_CHECKS=0")

        for(let i = 0; i < result.length; i++)
        {
            await connection.query("DROP TABLE IF EXISTS " + process.env.DB_NAME + "." + result[i].TABLE_NAME + ";")
        }
        
        await connection.query("SET FOREIGN_KEY_CHECKS=1")
        
        for(let i = 0; i < sqlStatements.length - 1; i++)
        {
            await connection.query(sqlStatements[i] + ";")
        }
    }
    catch(err)
    {
        console.log("Error during database reset:\n")
        console.log(err)
    }
}