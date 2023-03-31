const mongoose = require('mongoose')

const itemSchema = mongoose.Schema({
    'itemName': {
        type: String,
        required: true,
        trim: true 
    },
    'category': { 
        type: String,
        required: true 
    },
    'MRP': {
        type: Number,
        required: true 
    },
    'totalQuantity': {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("item",itemSchema)   