const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
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
    },
    'image': {
        type: String,
        default:""
    }
})

module.exports = mongoose.model("item",itemSchema)   