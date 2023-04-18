const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const db  = require('./config/setup').DB
const cors = require('cors')
const errorMiddleware = require('./middleware/error')


const app = express()

app.use(cors())
app.use(express.json());
app.use("/api/users", require("./routes/router"));
app.use(errorMiddleware)

mongoose.set("debug", true)
mongoose.connect(db).then(()=>{
    console.log("MongoDB connected successfully")
}).catch(err=>console.log(err))


app.listen(3000, () => {
    console.log('Server is running on port 3000')
})