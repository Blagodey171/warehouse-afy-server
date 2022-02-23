import {verifyJWTToken} from '../services/createNewToken'
const ConnectMongo = require('../services/connectMongo.js')
const jwt = require('jsonwebtoken')
const authentication = require('../services/authentication/authentication')
const entryDataValidation = require('../services/entryDataValidation.js')
const processingUserData = require('../services/login/processingUserData.ts')
const upgradeJWTTokenInSession = require('../services/authorization/upgradeJWTTokenInSession.ts')

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
                let userDataHandling = await authentication(req)

                res.status(200).json(userDataHandling)
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
                    throw {
                        errorMessage: 'К сожалению Вы не прошли авторизацию' // СДЕЛАТЬ ОТОБРАЖЕНИЕ ОШИБКИ НА КЛИЕНТЕ,
                    }
                }
                
                let token = req.headers.authorization.split(' ')[1]
                const decodeUserData = jwt.verify(token, process.env.JWT_SECRET_TOKEN)
                
                res.json({
                    decodeUserData,
                })
            } catch (errorMessage) {
                let createNewToken = await upgradeJWTTokenInSession(req)
                res.json(
                    createNewToken
                )

            }
        }
    }
}


module.exports = userHandler