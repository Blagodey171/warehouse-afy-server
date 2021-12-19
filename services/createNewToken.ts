const jwt = require('jsonwebtoken')


const JWTtoken = function (payload:string, time:string): string {
    return jwt.sign(
        { userLogin: payload },
        process.env.JWT_SECRET_TOKEN,
        { expiresIn: time }
    )
}

module.exports = JWTtoken