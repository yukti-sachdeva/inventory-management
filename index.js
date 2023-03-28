const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const db  = require('./config/setup').DB


mongoose.connect(db).then(()=>{
    console.log("MongoDB connected successfully")
}).catch(err=>console.log(err))
const app = express()
app.use(bodyParser());
app.use("/api/users", require("./routes/router"));


app.listen(3000, () => {
    console.log('Server is running on port 3000')
})