const router = require('express').Router()
const { emailRegister, verifyToken, userLogin, getUser, updatePassword, updateRole } = require('../controller/auth')
const { addItem, deleteItem, removeItem, updateItem, uploadImage, getItem, getCategory } = require('../controller/itemsController')
const { newOrder, deleteOrder, monthWiseOrder, dailyOrder } = require("../controller/ordersController")
const {upload} = require('../utils/multer')
const {checkPermissions} = require('../middleware/role')

router.post('/register-user', emailRegister)

router.post("/login-user", userLogin)

router.get("/protected-route", verifyToken, async(req, res) => {
    res.send({message: "Successful"})
})

router.get('/all-user', verifyToken, checkPermissions(['staff', 'admin'], 'role'), getUser)

router.post("/add-item", verifyToken, checkPermissions(['staff', 'admin'], 'role'), addItem)

router.delete('/delete-item', verifyToken, checkPermissions(['admin'], 'role'), deleteItem)


router.put("/remove-item",verifyToken, checkPermissions(['staff','admin'], 'role'), removeItem)

router.put("/update-item", verifyToken, checkPermissions(['admin'], 'role'), updateItem)

router.get("/get-item", verifyToken, checkPermissions(['staff', 'admin'], 'role'), getItem)
router.get("/get-category", verifyToken, checkPermissions(['staff', 'admin'], 'role'), getCategory)


router.post("/add-order", verifyToken, checkPermissions(['staff', 'admin'], 'role'), newOrder)

router.delete("/delete-order", verifyToken, deleteOrder)

router.post("/upload", verifyToken, checkPermissions(['admin'], 'role'),  upload.single('file'), uploadImage)

router.get("/get-monthly-order", verifyToken, checkPermissions(['admin'], 'role'), monthWiseOrder)

router.post("/reset-password", verifyToken, updatePassword)

router.put("/change-role", verifyToken, checkPermissions(['admin'], 'role'), updateRole)

router.get("/get-daily-order", verifyToken, checkPermissions(['admin'], 'role'), dailyOrder)

module.exports = router