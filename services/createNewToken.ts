const jwt = require('jsonwebtoken')

function JWTtoken (payload:string, time:string): string {
    return jwt.sign(
        { userLogin: payload },
        process.env.JWT_SECRET_TOKEN,
        { expiresIn: time }
    )
}

module.exports = JWTtoken