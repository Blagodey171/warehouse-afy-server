import {connectMongo} from '../connectMongo'
const mongoose = require('mongoose')
const User = require('../../schema/UserModel')
import {Iuser} from '../../schema/interfaceForUserModel'
const jwt = require('jsonwebtoken')
interface request {
    body: {
        login: string,
        deviceId: string
    },
    headers: {
        authorization: string
    }
}
interface response {
    json<T>(data: T): void
}
interface arrayResult {
    length: number,
    session: string
}
interface parseSession {
    user: string,
    token: string
    // возможно нужно сделать единый enum и тут по нему создавать интерфейс
}

async function upgradeJWTTokenInSession(request: request) {
    // let deviceId = request.body.deviceId
    // const login = request.body.login
    // const findUserInDatabase: Iuser = await User.findOne({ login })

    // let verifyResponse = jwt.verify(findUserInDatabase.refreshToken, process.env.JWT_SECRET_TOKEN, async function (err:any, decodedData:any) {
    //     if (err) {
    //         // findUserInDatabase.devices.isAuthorisation = false
    //         // findUserInDatabase.accessToken = ''
    //         // findUserInDatabase.refreshToken = ''
    //         await findUserInDatabase.save(function(err: any){
    //             mongoose.disconnect();
                
    //             if(err) return console.log(err);
                 
    //             console.log("Сохранен объект user", findUserInDatabase);
    //         })
    //         let errorResponse = {
    //             errorName: err.name,
    //             errorMessage: err.message,
    //             messageForUser: 'Время сессии вышло,войдите снова'
    //         }
    //         return errorResponse
    //     }
    //     let newAccessToken = jwt.sign(login, process.env.ACCESS_TOKEN_EXPIRES_IN)
    //     findUserInDatabase.accessToken = newAccessToken
    //     await findUserInDatabase.save(function(err: any){
    //         mongoose.disconnect();
             
    //         if(err) return console.log(err);
             
    //         console.log("Сохранен объект user", findUserInDatabase);
    //     })
    //     let updateResponse = {
    //         newAccessToken,
    //         decodedData,
    //         login,
    //         findUserInDatabase
    //     }
    //     return updateResponse
    // })
    // return verifyResponse
    
}

module.exports = upgradeJWTTokenInSession

// let token = request.headers.authorization.split(' ')[1]
    // token = verifyJWTToken(token, process.env.JWT_SECRET_TOKEN)

    // const parse: parseSession = JSON.parse(findResult.session)
    // if (parse.token !== token) {
    //     await connectMongoDatabaseCollection.deleteOne({_id: cookiesSessionWarehouse })
    //     connectMongo.disconnectDB()
    //     return response.json({
    //         errorMessage: 'Необходимо зайти под своим логином и паролем',
    //     }) // если в сессии токен не равен токену в теле запроса - значит юзер не логинился, но сессия его все равно создается.следовательно токен не обновляем и удаляем сессию
    // }
    // const newJWTToken: string = createJWTToken(parse.user, process.env.TOKEN_EXPIRES_IN)
    // parse.token = newJWTToken

    // const newSessionObject = JSON.stringify(parse)
    // await connectMongoDatabaseCollection.updateOne(
    //     { _id: cookiesSessionWarehouse },
    //     {
    //         $set: { 'session': `${newSessionObject}` },
    //         $currentDate: { lastModified: true }
    //     }
    // )
    // connectMongo.disconnectDB()