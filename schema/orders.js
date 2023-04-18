const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    "orderId": {
        type: mongoose.Schema.Types.ObjectId
    },
    "itemList": [{ 
        // _id: false,
        itemName: String, 
        quantity: Number , 
        itemId: {
            ref: "items", 
            type: mongoose.Schema.Types.ObjectId
        }
    }],
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