const { Schema, model } = require('mongoose')
const deviceSchema = new Schema({
    deviceId: {type: String, unique: true, default: '', sparse: true},
    isAuthorisation: {type: Boolean, required: true, default: false},
    loginDate: {type: Date}
})

const schemaTemplate = {
    login: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    devices: [deviceSchema],
    accessToken: { type: String , unique: true , sparse: true},
    refreshToken: { type: String, unique: true , sparse: true}
}
const UserSchema = new Schema(schemaTemplate)
const User = model('User', UserSchema)
module.exports = User