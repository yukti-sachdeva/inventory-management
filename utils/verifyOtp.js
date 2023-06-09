const {sendMail} = require('./sendMail')
const User = require('../schema/users')
const ErrorHandler = require("../utils/errorHandler");
const {Otp} = require('../schema/otp');


function generateOtp() {
    let digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

//Otp.createIndex({"createdAt": 1}, {expireAfterSeconds: 20})

const sendOtp = async(req, res) => {
    try{
    const {email} = req.body
    
    const otpGenerated = generateOtp()
    
            await sendMail({
                to: email,
                OTP: otpGenerated
            })

        await Otp.create({
            email: email,
            otp: otpGenerated
        })
        return res.status(200).json({
            message: `Verification email has been sent to ${email}`,
            success: true
        })
    
    }
    catch(error){
        console.log(error)
    }
}

const verifyOtp = async(req, res) => {
    const {email, otp} = req.body
    const userFound = await Otp.findOne({email: email})
    //console.log("15>>>>>>",userFound)
    if(!userFound){
        throw new ErrorHandler("No user found", 404)
    }
    if(otp!=userFound.otp){throw new ErrorHandler("Wrong OTP",403)}
    await User.findOneAndUpdate({email: email}, {isVerified: true})
    res.status(200).json({success:true,data:"otp verified"})  
    }




module.exports = {generateOtp, sendOtp, verifyOtp}
