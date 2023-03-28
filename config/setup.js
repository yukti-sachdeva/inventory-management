require('dotenv').config()

module.exports = {
    DB: process.env.APP_DB,
    PORT: process.env.PORT,
    SECRET: process.env.APP_SECRET,
    API_KEY: process.env.SENDGRID_API_KEY,
    OTP_LENGTH: 4,
    OTP_CONFIG: {
    upperCaseAlphabets: false,
    specialChars: false,
  }
};