const ConnectMongo = require('../connectMongo.js')
const jwt = require('jsonwebtoken')

const entryDataValidation = require('../services/entryDataValidation.js')
const processingUserData = require('../services/login/processingUserData')
const {upgradeJWTTokenInSession} = require('../services/auth/upgradeJWTTokenInSession')


const optionsRequestHandler = (req) => {
    if (req.method === 'OPTIONS') {
        return next()
    }
}
const userHandler = () => {
    return {
        async login(req, res, next) {
            optionsRequestHandler(req)
            try {
                entryDataValidation(req)
                let userDataHandling = await processingUserData(req)

                res.json(userDataHandling)
            } catch (errorMessage) {
                res.json(errorMessage)
            }
        },

        async logout (req, res, next) {
            optionsRequestHandler(req)
            try {
                let userDataHandling = await processingUserData(req)

                res.status(200).json(userDataHandling)
            } catch (errorMessage) {
                res.json(errorMessage)
            }
        },

        async registration(req, res, next) {
            optionsRequestHandler(req)
            try {
                entryDataValidation(req, res)
                const userDataHandling = await processingUserData(req)

                res.status(201).json(userDataHandling)
            } catch (errorMessage) {
                res.json(errorMessage)
            }
        },

        async authorization (req, res, next) {
            if (req.method === 'OPTIONS') {
                next()
            }
            try {
                if (!req.headers.authorization) {
                    throw {errorMessage: 'К сожалению Вы не прошли авторизацию'} // СДЕЛАТЬ ОТОБРАЖЕНИЕ ОШИБКИ НА КЛИЕНТЕ
                }
                let token = req.headers.authorization.split(' ')[1]
                const decodeUserData = jwt.verify(token, process.env.JWT_SECRET_TOKEN)

                // тут вытаскиваем объект с данными сессии
                
                res.json({
                    decodeUserData,
                })
            } catch (errorMessage) {
                // сюда перейдем ТОЛЬКО если нет токена или протух
                // req.sessionID берется из тела запроса, sessionID берется тот который создался и записался при последнем логине 
                
                // req.sessionID = false // обнулить айди сессии, потому что при единственном логине сразу создается сессия в БД и в теле request будет сохранен sessionID. Если даже в локалсторадж сделать любое поле 'token'
                const upgradeSession = upgradeJWTTokenInSession(req, res, errorMessage)
                return upgradeSession
            }
        }
    }
}


module.exports = userHandler