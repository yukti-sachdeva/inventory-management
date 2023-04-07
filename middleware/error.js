const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;

        err = new ErrorHandler(message, 400);

    }
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }




    // Wrong JWT error

    if (err.name === "JsonWebTokenError") {
        const message = `Json Web Token is invalid, Try again `;

        err = new ErrorHandler(message, 400);
    }

    // JWT EXPIRE error
    if (err.name === "TokenExpiredError") {
        const message = `Json Web Token is Expired, Try again `;
        err = new ErrorHandler(message, 400);
    }


    // sending response to frontend
    res.status(err.statusCode).json({
        success: false,
        error: err.message,
    });

};