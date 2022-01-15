import {User} from '../../schema/UserModel'
import {createConnectDB} from '../createConnectDB'

const bcrypt = require('bcryptjs')
const createJWTToken = require('../createNewToken')

interface Iuser {
    login: string,
    password: string,
    isAuthorisation: boolean,
    save () : Promise<void>
}
interface IrequestData {
    body: {
        login: string,
        password: string,
        handlerName: string,
    },
    session: {
        token: string,
        login: string,
    },
    sessionID: string
}
async function processingUserData (req: IrequestData) {
    try {
        const { login, password, handlerName } = req.body
        const { session, sessionID } = req
        const findUserInDatabase: Iuser = await User.findOne({ login })

        if (handlerName === 'LOGIN') {

            // Сразу создается сессия и айди сессии записывается в req(req.session, req.sessionID)
            if (!findUserInDatabase) { 
                throw {errorMessage: 'Данный пользователь не найден'} 
            }
            const hashPassword: boolean = await bcrypt.compare(password, findUserInDatabase.password)
            if (!hashPassword) {
                throw {errorMessage: 'Неверный логин или пароль' } 
            }
// 1.если зашел под своим,а потом под другим
// 2.с другого устройства под этим же логином

            const userSession = await createConnectDB(process.env.DATABASE_NAME, process.env.COLLECTION_NAME_SESSIONS, '_id', sessionID)
            const loginFromSession = JSON.parse(userSession.endData.session).login
            // if (login !== loginFromSession) {
            //     // если логин из сессии не равен логину при регистрации, то необходимо создавать новую сессию для другого пользователя
            // }
            const JWTToken:string = createJWTToken(findUserInDatabase.login, process.env.TOKEN_EXPIRES_IN )
            session.token = JWTToken // <= записать в сессию необходимые данные , (partial || pick)
            session.login = login

                findUserInDatabase.isAuthorisation = true
                await findUserInDatabase.save()
            
            const responseLogin = {
                token: JWTToken,
                login: findUserInDatabase.login,
                findUserInDatabase,
                loginFromSession
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
            const responseRegistration = { message: 'Пользователь успешно создан', newUserLogin: login }
            return responseRegistration
        }
    } catch (errorMessage) {
        throw errorMessage
    }
    
}
module.exports = processingUserData