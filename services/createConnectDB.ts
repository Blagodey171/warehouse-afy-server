const ConnectMongo = require('./connectMongo')
interface IresponseConnect {
    endData: {
        expires: string,
        session: string,
    },
    // disconnectDatabase () : void
}
export async function createConnectDB (dbName: string, collectionName: string, searchField: string, dataForSearch: string): Promise<IresponseConnect> {
    const connectDatabase = new ConnectMongo(dbName,collectionName)
    const connectCollection = await connectDatabase.connectDB()

    const endData = await connectCollection.findOne({[searchField]: dataForSearch})
    connectDatabase.disconnectDB()
    return {
        endData
    }
}