const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    "orderId": {
        type: mongoose.Schema.Types.ObjectId
    },
    "itemList": [{itemName: String, quantity: Number}],

    "totalItems": {
        type: Number,
        required: true 
    },
    "totalPrice": {
        type: Number,
        required: true 
    },
    "orderStatus": {
        type: String,
        default: "new",
        enum: ["new", "pending", "completed", "cancelled"]
    },
    'date': {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("orders", orderSchema)