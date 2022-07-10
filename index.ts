// const cookieParser = require('cookie-parser')
// const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const session = require('express-session')
// const MongoStore = require('connect-mongo')
const path = require('path')
const userRouter = require('./routes/userRouter.js')

require('dotenv').config()
const app = express();
const PORT = process.env.PORT || 3001
async function start() {
    try {
        // await mongoose.connect(process.env.MOBGODB_URL, {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true
        // })
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


app.use('/api', userRouter)

app.get('/', (req: any, res: { send: (arg0: string) => void }) => {
    res.send('qwqwqwq')
});



