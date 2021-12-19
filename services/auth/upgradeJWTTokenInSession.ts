const jwt = require('jsonwebtoken')

const ConnectMongo = require('../../connectMongo')
const { createJWTToken } = require('../createNewToken')

interface request {
    sessionID: string | boolean
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

export const upgradeJWTTokenInSession = async function <Y>(request: request, response: response, errorMessage: Y) {
    const cookiesSessionWarehouse = request.sessionID
    let connectMongo = new ConnectMongo(process.env.DATABASE_NAME, process.env.COLLECTION_NAME_SESSIONS)
    let connectMongoDatabaseCollection = await connectMongo.connectDB()
    let findResult: arrayResult[] = await connectMongoDatabaseCollection.find({ id: cookiesSessionWarehouse }).toArray()
    let token = request.headers.authorization.split(' ')[1]
    if (!findResult.length) { // ошибка если время сессии истекло
        return response.json({
            errorMessage: 'expired session',
        })
    }
    const parse: parseSession = JSON.parse(findResult[0].session)
    if (parse.token !== token) {
        await connectMongoDatabaseCollection.deleteOne({ id: cookiesSessionWarehouse })
        return response.json({
            errorMessage: 'Необходимо зайти под своим логином и паролем',
        }) // если в сессии токен не равен токену в сессии - значит юзер не логинился, но сессия его все равно создается.следовательно токен не обновляем и удаляем сессию
    }
    const newJWTToken: string = createJWTToken(parse.user, process.env.TOKEN_EXPIRES_IN)
    parse.token = newJWTToken

    const newSessionObject = JSON.stringify(parse)
    await connectMongoDatabaseCollection.updateOne(
        { id: cookiesSessionWarehouse },
        {
            $set: { 'session': `${newSessionObject}` },
            $currentDate: { lastModified: true }
        }
    )
    connectMongo.disconnectDB()

    return response.json({
        parseSession: {
            ...parse,
        }
    })
}