const router = require('express').Router()
const { emailRegister, verifyToken, userLogin } = require('../controller/auth')
const { addItem, deleteItem, removeItem, updateItem, uploadImage, getItem, getCategory } = require('../controller/itemsController')
const { newOrder, deleteOrder } = require("../controller/ordersController")
// const itemModel=require('../schema/items')
const {upload} = require('../utils/multer')

// const multer = require("multer")
// const upload = multer({storage: multer.diskStorage()}) 

router.post('/register-user', emailRegister)

router.post("/login-user", userLogin)

router.get("/protected-route", verifyToken, async(req, res) => {
    res.send({message: "Successful"})
})

router.post("/add-item", addItem)

router.delete('/delete-item', deleteItem)


router.put("/remove-item", removeItem)

router.put("/update-item", updateItem)

router.get("/get-item", getItem)
router.get("/get-category", getCategory)


router.post("/add-order", async(req, res) => {
    await newOrder(req.body, res)
})

router.delete("/delete-order", async(req, res) => {
    await deleteOrder(req.body, res)
})

router.post("/upload", upload.single('file'), uploadImage)


module.exports = router