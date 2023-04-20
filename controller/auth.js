const bcrypt = require('bcryptjs')
const { SECRET } = require('../config/setup')
const User = require('../schema/users')
const jwt = require('jsonwebtoken');
const ErrorHandler = require("../utils/errorHandler");
const sendMail = require('../utils/sendMail');
const {generateOtp} = require('../utils/verifyOtp')
const {Otp} = require('../schema/otp')

const validateUsername = async(username) => {
    let user = await User.findOne({username})
    return user ? true : false 
}

const validateEmail = async(email) => {
    let user = await User.findOne({email})
    return user
}


const emailRegister = async(req, res) => { 
    try{
    const userRegistered = await validateEmail(req.body.email)
    if(userRegistered){
        if(!userRegistered.isVerified){
            const newOtp = generateOtp()
            const message = `<div
            class="container"
            style="max-width: 90%; margin: auto; padding-top: 20px"
          >
            <h4>You are officially In ✔</h4>
            <p style="margin-bottom: 30px;">Please enter the verficaition OTP to get started</p>
            <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${newOtp}</h1>
       </div>`
            
            const checkUserinOtp = await Otp.findOne({email: req.body.email})
            if(checkUserinOtp){
                await checkUserinOtp.updateOne({otp: newOtp})
                
                await sendMail({
                    email:req.body.email,
                    subject:`User verifiaction mail`,
                    message:message
                })

                // await sendMail({
                //     to: req.body.email,
                //     OTP: newOtp
                // })
            }
            else{
                await Otp.create({
                    email: req.body.email,
                    otp: newOtp
                })
                
                await sendMail({
                    email:req.body.email,
                    subject:`User verifiaction mail`,
                    message:message
                })
            }
        }
        else{
            return res.status(403).json({
                message: "User is already registered and verified",
                success: false
            })
        }
    }else{

        
        const hashedPassword = await bcrypt.hash(req.body.password, 8)
        await User.create({
            email:req.body.email,
        password:hashedPassword,
        username:req.body.username,
        name:req.body.name,
        role:req.body.role
    })
    const otpGenerated = generateOtp()

    await Otp.create({
        email: req.body.email,
        otp: otpGenerated
    })
    const message = `<div
    class="container"
    style="max-width: 90%; margin: auto; padding-top: 20px"
  >
    <h4>You are officially In ✔</h4>
    <p style="margin-bottom: 30px;">Please enter the verficaition OTP to get started</p>
    <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${otpGenerated}</h1>
</div>`
    await sendMail({
        email:req.body.email,
        subject:`User verifiaction mail`,
        message:message
    })
}
    return res.status(200).json({
        message: `Verification email has been sent to ${req.body.email}`,
        success: true
    })
    }
    catch(error){
        console.log(error)
    }
}


const userLogin = async(req, res) => {
    //console.log(userCreds);
    try{
    let { email, password} = req.body;
    const user = await User.findOne({email})
    if(!user){
        throw new ErrorHandler("User not found",404)
       
    }
	console.log(SECRET);
    let isMatch = await bcrypt.compare(password, user.password)
    if(isMatch){
        let token = jwt.sign({
            user_id: user._id,
            role: user.role,
            username: user.username,
            email: user.email
        },
        SECRET,
        {expiresIn: "7 days"});

        let result = {
            username: user.username,
            role: user.role,
            email: user.email,
            name: user.name,
            token: token,
        }

        return res.status(200).json({
            ...result,
            message: "Logged in successfully",
            success: true 
        })
    }

    else{
        return res.status(403).json({
            message: "Incorrect password",
            success: false 
        })
    }
    }catch(error){
	console.log(error)
}
}

const verifyToken = async (req, res, next) => {
    let headerToken = req.headers['authorization']
    console.log("headerToken ",headerToken,"\n\n\n\n")
    if(headerToken){
        headerToken = headerToken.split(' ')[1];
        try {
            const token =  jwt.verify(headerToken, SECRET)
            const user = await User.findById(token.user_id)
            if(!user){
                throw new ErrorHandler("User not found", 404)
            }
        } catch (error) {
            return res.status(403).json({
                message: "Invalid token",
                success: false 
            })
        }
    }
    else{
        return res.status(403).json({
            message: "Please add token to the header",
            success: false 
        })
    }
    next()

}

const serializeUser = user => {
    return {
      username: user.username,
      email: user.email,
      name: user.name,
      _id: user._id,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt
    };
  };

  const getUser = async(req, res) => {
    let users = await User.find({})
    return res.status(200).json({
        message: "Here are all the users",
        users: users,
        success: true 
    })
  }
  

const resetPassword = async(req, res) => {
    const {email, password} = req.body

    const hashedPassword = await bcrypt.hash(password, 8)
    await User.findOneAndUpdate({email: email}, {password: hashedPassword})
    return res.status(200).json({
        message: "Password changed successfully",
        success: true 
    })
}

const updateRole = async(req, res) => {
    try{
    const {email,  role} = req.body
    console.log(email)
    const user = await User.findOne({email: email})
    if(!user){
        throw new ErrorHandler("User not found",404)
    }
    await User.findByIdAndUpdate(user._id, {role: role})
        return res.status(200).json({
            message: "Role updated successfully",
            success: true 
        })
    }
    catch(error){
	console.log(error)
}
}

module.exports = {emailRegister, verifyToken, userLogin, serializeUser, getUser, resetPassword, updateRole}
