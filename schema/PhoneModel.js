const { Schema, model } = require('mongoose')


const phoneInfo = new Schema({
    manufacturer: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    gigabyte: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    serialnumber: {
        type: Number,
        required: true
    },
})
const purchase = new Schema({
    // поставщик
    provider: {
        type: String,
    },
    // автор
    author: {
        type: String,
    },
    // склад
    warehouse: {
        type: String,
    },
    // время
    time: {
        type: Date,
    },
    // цена
    price: {
        type: Number,
    }
})
const payment = new Schema({
    // автор
    author: {
        type: String,
    },
    // касса
    cashbox: {
        type: String,
    },
    // тип оплаты
    paymentType: {
        type: Number,
    },
    // сумма
    sum: {
        type: Number,
    },
    // время
    time: {
        type: Date,
    },
})
const sale = new Schema({
    // покупатель
    customer: {
        type: String,
    },
    // автор
    author: {
        type: String,
    },
    // склад
    warehouse: {
        type: String,
    },
    // время
    time: {
        type: Date,
    },
    // цена
    price: {
        type: Number,
    },
    payment
})
const movement = new Schema({
    // откуда
    A: {
        type: String,
    },
    // куда
    B: {
        type: String,
    },
    // автор
    author: {
        type: String,
    },
    // время
    time: {
        type: Date,
    },
})
const purchaseReturn = new Schema({
    // покупатель
    customer: {
        type: String,
    },
    // автор
    author: {
        type: String,
    },
    // вернуть на какой склад
    warehouse: {
        type: String,
    },
    // время
    time: {
        type: Date,
    },
    // продажи цена
    price: {
        type: Number,
    },
})





const movementTest = new Schema({
    // тип перемещения(продажа,перемещение,возврат)
    typeOfMovement: {
        type: String
    },
    // откуда/от кого
    A: {
        type: String,
    },
    // куда/кому
    B: {
        type: String,
    },

    
    // покупатель
    customer: {
        type: String,
    },
    // цена покупки
    priceBuying: {
        type: Number,
    },
    // цена продажи 
    priceSelling: {
        type: Number,
    },
    payment,
    // флаг оплаты
    paymentFlag: {
        type: String,
        default: false
    },


    // автор
    author: {
        type: String,
    },
    // время
    time: {
        type: Date,
    },
})
const PhoneSchema = new Schema({
    phoneInfo,
    purchase,
    allMovement: [movementTest],
})
module.exports = model('Phone', PhoneSchema);

