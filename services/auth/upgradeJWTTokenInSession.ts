const ConnectMongo = require('../connectMongo')
const createJWTTokenSecond = require('../createNewToken')

interface req {
    session: {
        id: string
    }
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

const upgradeJWTTokenInSession = async function <Y>(request: req, response: response, errorMessage: Y) {
    const cookiesSessionWarehouse = request.sessionID
    let connectMongo = new ConnectMongo(process.env.DATABASE_NAME, process.env.COLLECTION_NAME_SESSIONS)
    let connectMongoDatabaseCollection = await connectMongo.connectDB()
    let findResult = await connectMongoDatabaseCollection.findOne({ _id: cookiesSessionWarehouse })
    let token = request.headers.authorization.split(' ')[1]
    if (!findResult) { // ошибка если время сессии истекло
        connectMongo.disconnectDB()
        return response.json({
            errorMessage: 'expired session',
            findResult,
            cookiesSessionWarehouse
        })
    }
    const parse: parseSession = JSON.parse(findResult.session)
    if (parse.token !== token) {
        await connectMongoDatabaseCollection.deleteOne({_id: cookiesSessionWarehouse })
        connectMongo.disconnectDB()
        return response.json({
            errorMessage: 'Необходимо зайти под своим логином и паролем',
        }) // если в сессии токен не равен токену в теле запроса - значит юзер не логинился, но сессия его все равно создается.следовательно токен не обновляем и удаляем сессию
    }
    const newJWTToken: string = createJWTTokenSecond(parse.user, process.env.TOKEN_EXPIRES_IN)
    parse.token = newJWTToken

    const newSessionObject = JSON.stringify(parse)
    await connectMongoDatabaseCollection.updateOne(
        { _id: cookiesSessionWarehouse },
        {
            $set: { 'session': `${newSessionObject}` },
            $currentDate: { lastModified: true }
        }
    )
    connectMongo.disconnectDB()

    return response.json({
        parseSession: {
            ...parse,
        },
        findResult
    })
}

module.exports = upgradeJWTTokenInSession