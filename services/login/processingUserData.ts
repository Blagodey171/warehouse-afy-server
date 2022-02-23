import {createConnectDB} from '../createConnectDB'
import {Iuser} from '../../schema/interfaceForUserModel'
import {createJWTToken} from '../createNewToken'
const User = require('../../schema/UserModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// interface Iuser {
//     login: string,
//     password: string,
//     isAuthorisation: boolean,
//     accessToken: string,
//     refreshToken: string,
//     save () : Promise<void>
// }
interface IrequestData {
    body: {
        login: string,
        password: string,
        handlerName: string,
        deviceId: string
    },
}
async function processingUserData (req: IrequestData) {
    try {
        const { login, password, handlerName, deviceId } = req.body
        const findUserInDatabase: Iuser = await User.findOne({ login })
        const maxAmountDevices = 3

        // if (handlerName === 'LOGIN') {
        //     if (!findUserInDatabase) { 
        //         throw {errorMessage: 'Данный пользователь не найден'} 
        //     }
        //     const hashPassword: boolean = await bcrypt.compare(password, findUserInDatabase.password)
        //     if (!hashPassword) {
        //         throw {errorMessage: 'Неверный логин или пароль' } 
        //     }
        //     // изменил схему юзеров в монгус, разработать вход под разные устройства
        //     // 2.с другого устройства под этим же логином
                        
        //     if( findUserInDatabase.devices.length >= maxAmountDevices ){
        //         throw {errorMessage: 'Максимум вход с трех устройств' }
        //     }
        //     findUserInDatabase.devices.push({
        //         deviceId: jwt.sign('ddd', '1000000'),
        //         isAuthorisation: true,
        //         loginDate: Date.now()
        //     })


        //     findUserInDatabase.accessToken = jwt.sign(findUserInDatabase.login, process.env.ACCESS_TOKEN_EXPIRES_IN)
        //     findUserInDatabase.refreshToken = jwt.sign(findUserInDatabase.login, process.env.REFRESH_TOKEN_EXPIRES_IN)
        //     await findUserInDatabase.save()

        //     const responseLogin = {
        //         accessTokenJWT: findUserInDatabase.accessToken,
        //         refreshTokenJWT: findUserInDatabase.refreshToken,
        //         login: findUserInDatabase.login,
        //         findUserInDatabase,
        //     }
        //     return responseLogin

        if (handlerName === 'LOGOUT') {
            // findUserInDatabase.devices.isAuthorisation = false
            await findUserInDatabase.save()
            return { message: 'Вы вышли из учетной записи'}
            
        } else if (handlerName === 'REGISTRATION') {
            if (findUserInDatabase) { 
                throw {errorMessage: 'Данный пользователь существует'} 
            }
            const bcryptHash: string = await bcrypt.hash(password, 4)
            const user = new User({ login, password: bcryptHash })
            await user.save()
            const responseRegistration = { message: 'Пользователь успешно создан', newUserLogin: login }
            return responseRegistration
        }
    } catch (errorMessage) {
        throw errorMessage
    }
    
}
module.exports = processingUserData