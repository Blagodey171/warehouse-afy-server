import {Iuser} from '../../schema/interfaceForUserModel'
const jwt = require('jsonwebtoken')
const upgradeJWTTokenInSession = require('./upgradeJWTTokenInSession')


interface Iauth extends Iuser {
    headers: {
        authorization: string
    }
}


async function authorization (req: Iauth) {
    const {login, deviceId} = req.body
    
    try {
        if (!req.headers.authorization) {
            throw {
                errorMessage: 'К сожалению Вы не прошли авторизацию' // СДЕЛАТЬ ОТОБРАЖЕНИЕ ОШИБКИ НА КЛИЕНТЕ,
            }
        }
        let token = req.headers.authorization.split(' ')[1]
        const decodeUserData = jwt.verify(token, process.env.JWT_SECRET_TOKEN)
        
        return {
            decodeUserData,
        }
    } catch (errorMessage) {
        let createNewToken = await upgradeJWTTokenInSession(login, deviceId)
        return createNewToken
        

    }



}

module.exports = authorization