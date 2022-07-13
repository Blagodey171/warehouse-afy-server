const User = require('../../schema/UserModel')
const jwt = require('jsonwebtoken')
const pool = require('../../pool/pool')

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

async function upgradeJWTTokenInSession(login:string, deviceId: string) {
    const client = await pool.connect()

    let tokenDeviceForUpdate = await client.query(`SELECT RefreshToken FROM devices WHERE DeviceId = '${deviceId}'`)
    let verifyTokenForUpdate = jwt.verify(tokenDeviceForUpdate.rows[0].refreshtoken, process.env.JWT_SECRET_TOKEN_REFRESH)


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
            return verifyTokenForUpdate
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