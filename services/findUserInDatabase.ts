import {Iuser} from '../schema/interfaceForUserModel'
const User = require('../schema/UserModel')

async function findUserInDatabase (login: string) {
    const findUserInDatabase: Iuser = await User.findOne({login})
    return findUserInDatabase
}
module.exports = findUserInDatabase