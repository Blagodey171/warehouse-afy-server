import { Iuser } from '../../schema/interfaceForUserModel'
const mongoose = require('mongoose')
const findUserInDatabase = require('../findUserInDatabase')
const connectDB = require('../connectDB')
interface Irequest {
    body: {
        login: string
        deviceId: string
    }
}
async function logout(req: Irequest) {
    connectDB()
    const { login, deviceId } = req.body
    // let userInDatabase: Iuser = await findUserInDatabase(login)
    try {
        // userInDatabase.devices.forEach((device) => {
        //     if(device.deviceId === deviceId) {
        //         device.remove() // удаление объекта при логауте с совпавшим Id
        //     }
        // })
        // await userInDatabase.save(function (errorMessage: any) {
        //     mongoose.disconnect()
        //     if (errorMessage) throw errorMessage
        // })
        // return {
        //     message: 'Вы вышли из учетной записи'
        // }
    } catch (errorMessage) {
        throw errorMessage
    }
}

module.exports = logout