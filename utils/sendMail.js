const sgMail = require('@sendgrid/mail')
//const { API_KEY } = require('../config/setup')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendMail = async(params) => {
    try {
        let info = sgMail.send({
            to: params.to,
            from: "yukti.s@antino.io",
            subject: "Password reset verification",
            html: `<div
            class="container"
            style="max-width: 90%; margin: auto; padding-top: 20px"
          >
            <h4>You are officially In ✔</h4>
            <p style="margin-bottom: 30px;">Please enter the verficaition OTP to get started</p>
            <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.OTP}</h1>
       </div>
        `
        });
        return info
    }
    catch(error){
        console.log(error)
        return false;
    }
}

module.exports = {sendMail}