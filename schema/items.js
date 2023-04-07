const mongoose = require('mongoose')
const categories = ['pen', 'pencil', 'eraser', 'sharpener', 'books', 'notebooks']
//const {categories} = require('../enums/catagory');

const itemSchema = new mongoose.Schema({
    'itemName': {
        type: String,
        required: true,
        trim: true 
    },
    'category': { 
        type: String,
        required: true,
        enum: categories
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

const Item = mongoose.model("item",itemSchema)  
module.exports = {Item, categories}