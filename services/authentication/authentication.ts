
import {Iuser} from '../../schema/interfaceForUserModel'
const Crypto = require('crypto-js/aes')
const bcrypt = require('bcryptjs')
const User = require('../../schema/UserModel')
const jwt = require('jsonwebtoken')

interface IrequestData {
    body: {
        login: string,
        password: string,
    },
}
async function authentication (req: IrequestData ) {
    const { login, password } = req.body
    const findUserInDatabase: Iuser = await User.findOne({ login })
    const maxAmountDevices = 3
    try {
        if (!findUserInDatabase) { 
            throw {errorMessage: 'Данный пользователь не найден'} 
        }
        const hashPassword: boolean = await bcrypt.compare(password, findUserInDatabase.password)
        if (!hashPassword) {
            throw {errorMessage: 'Неверный логин или пароль' } 
        }
        // изменил схему юзеров в монгус, разработать вход под разные устройства
        // 2.с другого устройства под этим же логином
                    
        if( findUserInDatabase.devices.length >= maxAmountDevices ){
            throw { errorMessage: 'Нельзя войти больше, чем на три устройства' }
        }
        let deviceCrypto: string = Crypto.encrypt('login', 'maxdevice3').toString()
        findUserInDatabase.devices.push({
            deviceId: deviceCrypto,
            isAuthorisation: true,
            loginDate: Date.now()
        })
    
    
        findUserInDatabase.accessToken = jwt.sign(findUserInDatabase.login, process.env.ACCESS_TOKEN_EXPIRES_IN)
        findUserInDatabase.refreshToken = jwt.sign(findUserInDatabase.login, process.env.REFRESH_TOKEN_EXPIRES_IN)
        await findUserInDatabase.save()
    
        const responseLogin = {
            accessTokenJWT: findUserInDatabase.accessToken,
            // refreshTokenJWT: findUserInDatabase.refreshToken,
            login: findUserInDatabase.login,
            deviceCrypto
        }
        return responseLogin
    } catch(errorMessage) {
        throw errorMessage
    }
}

module.exports = authentication