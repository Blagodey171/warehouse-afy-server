const { validationResult } = require('express-validator')

const entryDataValidation = (request, response) => {
    try {
        let err = validationResult(request)

        if (!err.isEmpty()) {
            throw {
                errorMessage: 'Проверьте вводимые данные'
            }
        }
    } catch (error) {
        throw error
    }
}

module.exports = entryDataValidation