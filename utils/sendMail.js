const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        service: 'gmail',
        secure: true,
        auth: {
            user: 'yukti845@gmail.com',
            pass: 'eqpakeumvrdxogsc'
        },
    });

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;