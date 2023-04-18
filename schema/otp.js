const mongoose = require('mongoose')

const otpSchema = mongoose.Schema({
    email: {
        type: String,
        required: true 
    },
    otp: {
        type: Number, 
        required: true
    }
}
,
{
    timestamps: true
}
// {
//     expireAfterSeconds: 60
)
// otpSchema.createIndex({ createdAt: 1 },  );
const Otp = mongoose.model('Otp', otpSchema);
module.exports = {Otp}