const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    'name': {
        type: String,
        required: true
    },
    'email': {
        type: String,
        required: true,
        unique:true
    },
    'password': {
        type: String,
        required: true 
    },
    'username': {
        type: String,
        required: true 
    }, 
    'role': {
        type: String,
        default: 'staff',
        enum: ['staff', 'admin']
    },
    isVerified:{
        type: Boolean,
        default: false 
    }
})

module.exports=mongoose.model("user",userSchema)    