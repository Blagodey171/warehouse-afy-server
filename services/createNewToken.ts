const jwt = require('jsonwebtoken')

export function createJWTToken (payload:string, time:string): string {
    return jwt.sign(
        { userLogin: payload },
        process.env.JWT_SECRET_TOKEN,
        { expiresIn: time }
    )
}
// : {name: string, message: string, expiredAt: number } | {iat: number, exp: number, userLogin: string} 
export function verifyJWTToken (token: string, secret: string): any {
    jwt.verify(token, secret, function (err: any, decoded: any) {
        if(err) {
            return {
                name: err.name,
                errorMessage: 'Время сессии вышло, войдите снова'
            }
        } else {
            return decoded
        }
    })
}