const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    "orderId": {
        type: mongoose.Schema.Types.ObjectId
    },
    "itemList": [{ itemName: String, quantity: Number }],

    "totalItems": {
        type: Number
    },
    "totalPrice": {
        type: Number
    },
    "orderStatus": {
        type: String,
        default: "new",
        enum: ["new", "pending", "completed", "cancelled"]
    }
},
    { timestamps: true }
)

module.exports = mongoose.model("orders", orderSchema)