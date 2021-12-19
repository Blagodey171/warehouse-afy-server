const { Schema, model } = require('mongoose')

const schemaTemplate = {
    login: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isAuthorisation: {type: Boolean, required: true, default: false}
}
const UserSchema = new Schema(schemaTemplate)


const User = model('User', UserSchema);
module.exports = User