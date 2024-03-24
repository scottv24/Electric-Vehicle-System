const jwt = require('jsonwebtoken')

module.exports = { GetJWT }

function GetJWT(userID, expiration="1h"){
    const token = jwt.sign({ userId: userID }, process.env.JWT_SECRET, {
        expiresIn: expiration,
    })

    return token
}