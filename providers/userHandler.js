const jwt = require('jsonwebtoken')
const authentication = require('../services/authentication/authentication')
const registration = require('../services/registration/registration')
const logout = require('../services/logout/logout')
const entryDataValidation = require('../services/entryDataValidation.js')
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
                let userDataHandling = await logout(req)

                res.status(200).json(userDataHandling)
            } catch (errorMessage) {
                res.json(errorMessage)
            }
        },

        async registration(req, res, next) {
            optionsRequestHandler(req)
            try {
                entryDataValidation(req, res)
                const userDataHandling = await registration(req)

                res.status(201).json(userDataHandling)
            } catch (errorMessage) {
                res.json(errorMessage)
            }
        },

        async authorization (req, res, next) {
            optionsRequestHandler(req)
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