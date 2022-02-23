const { Schema, model } = require('mongoose')

interface Idevices {
    deviceId: string,
    isAuthorisation: boolean,
    loginDate: number
}
export interface Iuser {
    login: string,
    password: string,
    devices: Idevices[],
    accessToken: string,
    refreshToken: string,
    save () : Promise<void>
}

const schemaTemplate = {
    login: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    devices: [
        {
            deviceId: {type: String, required: true, unique: true},
            isAuthorisation: {type: Boolean, required: true, default: false},
            loginDate: {type: Date}
        }
    ],
    accessToken: { type: String, unique: true },
    refreshToken: { type: String, unique: true }
}
const UserSchema = new Schema(schemaTemplate)
const User = model('User', UserSchema)
module.exports = User