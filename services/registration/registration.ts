import {Iuser} from '../../schema/interfaceForUserModel'
const pool = require('../../pool/pool')
const bcrypt = require('bcryptjs')

const errorCode = require('../errorCode/errorCode')

async function registration(req: Iuser) {
    const { login, password } = req.body
    const date = new Date()
    const client = await pool.connect()
    try {
        let userInDatabase = await client.query(`SELECT * FROM users WHERE Login = '${login}'`)
        if (userInDatabase.rowCount === 1) {
            throw {
                errorMessage: errorCode[4],
                errorCode: 4
            }
        }
        const bcryptHash: string = await bcrypt.hash(password, 4)
        const loginUser = await client.query('INSERT INTO users (Login, Password, DateCreate) values ($1, $2, $3) RETURNING *', [login, bcryptHash, new Intl.DateTimeFormat('en-Us').format(date)])

        const responseRegistration = { message: 'Пользователь успешно создан', newUserLogin: login }
        return responseRegistration
    } catch (errorMessage) {
        throw errorMessage
    } finally {
        client.release()
    }
}

module.exports = registration