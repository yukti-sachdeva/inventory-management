const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    }
})

module.exports = mongoose.model("categories", categorySchema)