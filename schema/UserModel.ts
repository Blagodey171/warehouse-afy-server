const { Schema, model } = require('mongoose')


const schemaTemplate = {
    login: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    devices: [
        {
            deviceId: {type: String, required: true, unique: true},
            isAuthorisation: {type: Boolean, required: true, default: false},
            loginDate: {type: Date, default: Date.now}
        }
    ],
    accessToken: { type: String, unique: true },
    refreshToken: { type: String, unique: true }
}
const UserSchema = new Schema(schemaTemplate)


export const User = model('User', UserSchema);