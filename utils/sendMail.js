const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        service: 'gmail',
        secure: true,
        auth: {

            user: "yatinnarula99913@gmail.com",

            pass: "edoorxikgfphclat",

        },
    });

    const mailOptions = {
        from: "yukti845@gmail.com",
        to: "sunil.r@antino.io",
        subject: "hiii",
        html: "   ",
    };

    await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;