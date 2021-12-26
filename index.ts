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
app.options('*', cors())


app.use('/api/login',
    session({
        store: MongoStore.create({
            mongoUrl: process.env.MOBGODB_URL,
            stringify: true
        }),
        secret: process.env.SECRET_KEY_SESSION,
        saveUninitialized: true,
        resave: false,
        cookie: {
            sameSite: 'none',
            httpOnly: true,
            secure: false,
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



