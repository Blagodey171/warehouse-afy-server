
import {Iuser} from '../../schema/interfaceForUserModel'
const Crypto = require('crypto-js/aes')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../../pool/pool')
const errorCode: IerrorCode = require('../errorCode/errorCode')

interface IerrorCode {
    1 : string,
    2 : string,
    3 : string,
}
interface IuserFromDatabase {
    rowCount: number,
    rows: {
        id: number,
        login: string,
        password: string,
        datecreate: string
    }[]
}

interface IDeviceUserFromDatabase {
    rowCount: number,
    rows: {
        Id: number,
        AccessToken: string
        RefreshToken: string,
        DateCreate: string,
        IsAuthorisation: boolean,
        DeviceUser: number
    }[]
}

interface IreturnDeviceData {
    rows: [{
        deviceid: number
    }]
}


async function authentication (req: Iuser ) {
    const { login, password } = req.body
    const maxAmountDevices = 3
    const client = await pool.connect()
    const date = new Date()
    try {
        let userInDatabase: IuserFromDatabase = await client.query(`SELECT * FROM users WHERE Login = '${login}'`)
        if (userInDatabase.rowCount === 0) {
            throw {
                errorMessage: errorCode[2], // пользователь не найден
                errorCode: 2
            }
        }

        let passwordChecking: boolean = await bcrypt.compare(password, userInDatabase.rows[0].password)
        if ( !passwordChecking ) {
            throw {
                errorMessage: errorCode[3], // неверный логин\пароль
                errorCode: 3
            }
        }

        const loginUserId = userInDatabase.rows[0].id
        let amountDevicesUser: IDeviceUserFromDatabase = await client.query(`SELECT * FROM devices WHERE DeviceUser = '${loginUserId}'`)
        // ПРОВЕРКА НА НАЛИЧИЕ УСТРОЙСТВ ПОД ЭТИМ ЛОГИНОМ
        if ( amountDevicesUser.rowCount === maxAmountDevices ) {
            throw {
                errorMessage: errorCode[1], // больше 3 устройств
                errorCode: 1
            }
        } else {
            let accessToken: string = jwt.sign({data: login}, process.env.JWT_SECRET_TOKEN_ACCESS, {expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN})
            let refreshToken: string = jwt.sign({data: login}, process.env.JWT_SECRET_TOKEN_REFRESH, {expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN})
            let newDeviceId: IreturnDeviceData = await client.query('INSERT INTO devices (AccessToken, RefreshToken, DateCreate, IsAuthorisation, DeviceUser) values ($1, $2, $3, $4, $5) RETURNING deviceid', [accessToken, refreshToken, new Intl.DateTimeFormat('en-Us').format(date), true, loginUserId])
            
            return {
                deviceId: newDeviceId.rows[0].deviceid,
                login,
                accessToken,
                userInDatabase,
                amountDevicesUser,
            }
        }

        
    } catch(errorMessage) {
        throw errorMessage
    } finally {
        client.release()
    }
}

module.exports = authentication


// try {
    //     
    //     const hashPassword: boolean = await bcrypt.compare(password, userInDatabase.password)
    //     if (!hashPassword) {
    //         throw {errorMessage: 'Неверный логин или пароль' } 
    //     }
    //     // изменил схему юзеров в монгус, разработать вход под разные устройства
    //     // 2.с другого устройства под этим же логином
                    
    //     if( userInDatabase.devices.length >= maxAmountDevices ){
    //         throw { errorMessage: 'Нельзя войти больше, чем на три устройства' }
    //     }
    //     let deviceCrypto: string = Crypto.encrypt('login', 'maxdevice3').toString()
    //     userInDatabase.devices.push({
    //         deviceId: deviceCrypto,
    //         isAuthorisation: true,
    //         loginDate: Date.now()
    //     })
    
    
    //     userInDatabase.accessToken = jwt.sign(userInDatabase.login, process.env.ACCESS_TOKEN_EXPIRES_IN)
    //     userInDatabase.refreshToken = jwt.sign(userInDatabase.login, process.env.REFRESH_TOKEN_EXPIRES_IN)
    //     await userInDatabase.save(function(errorMessage: any){
    //         mongoose.disconnect();
    //         if(errorMessage) throw errorMessage
    //     })
    
    //     const responseLogin = {
    //         accessTokenJWT: userInDatabase.accessToken,
    //         // refreshTokenJWT: userInDatabase.refreshToken,
    //         login: userInDatabase.login,
    //         deviceCrypto
    //     }