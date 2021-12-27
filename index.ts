const cookieParser = require('cookie-parser')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const path = require('path')
const userRouter = require('./routes/userRouter')
require('dotenv').config()
const app = express();

const PORT = process.env.PORT || 3001
async function start() {
    try {
        await mongoose.connect(process.env.MOBGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => {
            console.log('server starting')
        })
    } catch (e) {
        console.log(e)
    }
}
start()
app.use(express.static(path.join(__dirname, 'dist')))

app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: true,
    credentials: true,
}))
// app.options('*', cors({
//     origin: true,
// }))


app.use('/api/login',
    session({
        store: MongoStore.create({
            mongoUrl: process.env.MOBGODB_URL,
            stringify: true
        }),
        secret: process.env.SECRET_KEY_SESSION,
        saveUninitialized: true,
        resave: false,
        // local
        // sameSite: none, secure: true - на локальной машине кука записывается если удалено поле sameSite,если поле есть то кука не записывается но обновляет токен в БД --- ПРОБЛЕМА В ПОИСКЕ СЕССИИ МЕТОДОМ find (правильно findOne)???
        // heroku
        // sameSite: none, secure: true - сначала работает кука не записана на клиенте,обновляется токен в БД,все работает как надо,потом ломается --- ПРОБЛЕМА В ПОИСКЕ СЕССИИ МЕТОДОМ find (правильно findOne)???
        cookie: {
            sameSite: 'none',
            httpOnly: true,
            secure: true,
            maxAge: 5000000,
            path: '/'
        },
        name: 'sessionWarehouse'
    })
)
app.use('/api', userRouter)

app.get('/', (req: any, res: { send: (arg0: string) => void }) => {
    res.send('qwqwqwq')
});



