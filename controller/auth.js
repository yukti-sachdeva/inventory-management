const bcrypt = require('bcryptjs')
const { SECRET, OTP_CONFIG, OTP_LENGTH } = require('../config/setup')
const User = require('../schema/users')
const jwt = require('jsonwebtoken');
const { sendMail } = require('../sendMail/send')

console.log(SECRET);

const validateUsername = async(username) => {
    let user = await User.findOne({username})
    return user ? true : false 
}

const validateEmail = async(email) => {
    let user = await User.findOne({email})
    return user ? true : false 
}


const emailRegister = async(req, res) => {
    let userDetail = req.body 
    let usernameTaken = await validateUsername(userDetail.username)
    
    if(usernameTaken){
        return res.status(400).json({
            message: "This username is already taken",
            success: false 
        })
    }
    let emailRegistered = await validateEmail(userDetail.email)
    if (emailRegistered){
        return res.status(400).json({
            message: "This email is already registered",
            success: false 
        })
    }
    const password = await bcrypt.hash(req.body.password, 8)
    
    const newUser = new User({
        ...userDetail,
        password
    })

    await newUser.save()
    return res.status(200).json({
        message: "User registered successfully",
        success: true 
    })

}

const userLogin = async(req, res) => {
    //console.log(userCreds);
    let { email, password} = req.body;
    const user = await User.findOne({email})
    if(!user){
        return res.status(404).json({
            message: "User does not exist",
            success: false
        })
    }
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
}

const verifyToken = async (req, res, next) => {
    let headerToken = req.headers['authorization']
    console.log("headerToken ",headerToken,"\n\n\n\n")
    if(headerToken){
        headerToken = headerToken.split(' ')[1];
        try {
            const token =  jwt.verify(headerToken, SECRET)
            console.log(token)
            next();
        } catch (error) {
            return res.status(403).json({
                message: "Please add token to the header",
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
  
  const generateOTP = () => {
    const OTP = otpGenerator.generate(OTP_LENGTH, OTP_CONFIG)
    return OTP 
}

const checkRole = async(userDetail, res) => {
    let {role} = userDetail
    
}

module.exports = {emailRegister, verifyToken, userLogin, serializeUser}