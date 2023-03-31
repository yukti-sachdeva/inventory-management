const router = require('express').Router()
const { emailRegister, verifyToken, userLogin } = require('../utils/auth')
const { addItem, deleteItem, removeItem, updateItem } = require('../utils/itemsController')
const { newOrder, deleteOrder } = require("../utils/ordersController")
const userModel=require('../schema/users')


router.post('/register-user', async(req, res) => {
    try {
        await emailRegister(req.body, res)
        
    } catch (error) {
        console.log(error,7777);
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

router.delete('/delete-item', async(req, res) => {
    await deleteItem(req.body, res)
})
router.put("/remove-item", async(req, res) => {
    await removeItem(req.body, res)
})

router.put("/update-item", async(req, res) => {
    await updateItem(req.body, res)
})
router.post("/add-order", async(req, res) => {
    await newOrder(req.body, res) 
})

router.delete("/delete-order", async(req, res) => {
    await deleteOrder(req.body, res)
})

module.exports = router