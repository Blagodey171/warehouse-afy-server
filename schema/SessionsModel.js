const { Schema,  model} = require('mongoose')

const SesionsModel = new Schema({
    user: {type: Schema.Types.ObjectId, ref:'User', required: true},
    refreshToken: {type: String, required: true}
})

module.exports = model('SesionsModel', SesionsModel)