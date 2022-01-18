// const cookieParser = require('cookie-parser')
// const bodyParser = require('body-parser')
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

app.use(express.json())
app.use(cors({
    origin: true,
    credentials: true,
}))

// не обновляет токен так как в тело запроса не сохраняется sessionID поле и не возможно найти такую сессию,полагаю берется первая запись в бд(вначале записи старше,а нам нужна новая для обновления)
        // ЕЩЕ ПРОВЕРЯТЬ КАК РАБОТАЕТ НА ЛОКАЛКЕ И ХЕРОКУ ПРИ НАСТОЯЩИХ КОНФИГАХ cors, как будто на локалке ищет сессию правильно а на хероку нет
        // local
        // sameSite: none, secure: true - на локальной машине кука записывается если удалено поле sameSite,если поле есть то кука не записывается но обновляет токен в БД --- ПРОБЛЕМА В ПОИСКЕ СЕССИИ МЕТОДОМ find (правильно findOne)???
        // heroku
        // sameSite: none, secure: true - сначала работает кука не записана на клиенте,обновляется токен в БД,все работает как надо,потом ломается --- ПРОБЛЕМА В ПОИСКЕ СЕССИИ МЕТОДОМ find (правильно findOne)???

app.use('/api',
    session({
        store: MongoStore.create({
            mongoUrl: process.env.MOBGODB_URL,
            stringify: true
        }),
        secret: process.env.SECRET_KEY_SESSION,
        saveUninitialized: false,
        resave: false,
        rolling: true,
        cookie: {
            // sameSite: 'strict',
            httpOnly: true,
            secure: false,
            maxAge: 50000,
            path: '/'
        },
        name: 'sessionWarehouse'
    })
)
app.use('/api', userRouter)

app.get('/', (req: any, res: { send: (arg0: string) => void }) => {
    res.send('qwqwqwq')
});



