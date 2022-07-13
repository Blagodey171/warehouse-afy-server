const jwt = require('jsonwebtoken')
const authentication = require('../services/authentication/authentication')
const registration = require('../services/registration/registration')
const logout = require('../services/logout/logout')
const entryDataValidation = require('../services/entryDataValidation.js')
const authorization = require('../services/authorization/authorization')

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
                const userDataHandling = await authorization(req)
                
                res.json(userDataHandling)
            } catch (errorMessage) {
                res.json(
                    errorMessage
                )

            }
        }
    }
}


module.exports = userHandler