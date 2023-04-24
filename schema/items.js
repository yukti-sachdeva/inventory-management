const mongoose = require('mongoose')
//const categories = ['pen', 'pencil', 'eraser', 'sharpener', 'books', 'notebooks']

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
},
{timestamps:true})

module.exports = mongoose.model("items",itemSchema); 