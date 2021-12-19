const bcrypt = require('bcryptjs')
const User = require('../../schema/UserModel')
const createJWTToken = require('../createNewToken')

interface IloginObject {
    token: string,
    login: string,
    sessionIDtest:string
}
interface IregistrationObject {
    message: string,
    newUserLogin: string
}
interface Isession {
    token: string,
    user: string,
}
interface Ibody {
    login: string,
    password: string,
    handlerName: string,
}
async function processingUserData<T extends {
    body: Ibody,
    session: Isession,
    sessionID: string // <= ТИП ЭНИ ДЛЯ ТЕСТА,ИСПРАВИТЬ
}> (req: T) {
    try {
        const { login, password, handlerName } = req.body
        const { session } = req
        const findUserInDatabase = await User.findOne({ login })

        if (handlerName === 'LOGIN') {
            // Сразу создается сессия и айди сессии записывается в req(req.session, req.sessionID)
            if (!findUserInDatabase) { 
                throw {errorMessage: 'Данный пользователь не найден'} 
            }
            const hashPassword: boolean = await bcrypt.compare(password, findUserInDatabase.password)
            if (!hashPassword) {
                throw {errorMessage: 'Неверный логин или пароль' } 
            }
            const JWTToken:string = createJWTToken(findUserInDatabase.login, process.env.TOKEN_EXPIRES_IN )

            session.token = JWTToken // <= записать в сессию необходимые данные , (partial || pick)
            session.user = login

            findUserInDatabase.isAuthorisation = true
            await findUserInDatabase.save()

            const responseLogin: IloginObject = {
                token: JWTToken,
                login: findUserInDatabase.login,
                sessionIDtest: req.sessionID
            }
            return responseLogin
        } else if (handlerName === 'LOGOUT') {
            findUserInDatabase.isAuthorisation = false
            await findUserInDatabase.save()
            return { message: 'Вы вышли из учетной записи'}
        } else if (handlerName === 'REGISTRATION') {
            if (findUserInDatabase) { 
                throw {errorMessage: 'Данный пользователь существует'} 
            }
            const bcryptHash: string = await bcrypt.hash(password, 4)
            const user = new User({ login, password: bcryptHash })
            await user.save()
            const responseRegistration: IregistrationObject = { message: 'Пользователь успешно создан', newUserLogin: login }
            return responseRegistration
        }
    } catch (errorMessage) {
        throw errorMessage
    }
    
}
module.exports = processingUserData