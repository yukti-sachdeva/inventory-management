const router = require('express').Router()
const { emailRegister, verifyToken, userLogin } = require('../utils/auth')
const { addItem } = require('../utils/itemsController')
const userModel=require('../schema/users')


router.post('/register-user', async(req, res) => {
    try {
        await emailRegister(req.body, res)
    } catch (error) {
        console.log(error);
    }
})

router.post("/login-user", async(req, res) => {
    await userLogin(req.body, res)
})

router.get("/protected-route", verifyToken, async(req, res) => {
    res.send({message: "Successful"})
})

router.post("/add-item", async(req, res) => {
    await addItem(req.body, res)
})

module.exports = router