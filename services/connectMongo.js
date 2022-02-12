const { MongoClient } = require('mongodb')

export class connectMongo {
    client = new MongoClient('mongodb+srv://perelad797:Pereladdenis8980@warehouse-cluster.iya4c.mongodb.net')

    constructor(dbName, collectionName) {
        this.dbName = dbName,
        this.collectionName = collectionName
    }

    async connectDB () {
        await this.client.connect()
        const db = this.client.db(this.dbName)
        const collection = db.collection(this.collectionName)
        return collection
    }

    async disconnectDB () {
        this.client.close()
    }
}