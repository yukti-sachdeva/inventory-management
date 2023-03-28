const mongoose = require('mongoose')

const saleSchema = mongoose.Schema({
    'itemId': {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'itemSchema',
        required: true
    },
    'itemName': {
        type: String,
        required: true 
    },
    'category': {
        type: String,
        required: true 
    },
    'quantity': {
        type: Number,
        required: true
    },
    'date': {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("sales", saleSchema)