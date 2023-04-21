const router = require('express').Router()
const { emailRegister, verifyToken, userLogin, getUser, updateRole, resetPassword } = require('../controller/auth')
const { addItem,  removeItem, updateItem, uploadItemImage, getItem } = require('../controller/itemsController')
const { newOrder, deleteOrder, monthWiseOrder, dailyOrder } = require("../controller/ordersController")
const {upload} = require('../utils/multer')
const {checkPermissions} = require('../middleware/role')
const {sendOtp, verifyOtp} = require('../utils/verifyOtp')
const {addCategory, deleteCategory, getCategory} = require('../controller/categoryController')

router.post('/register-user', emailRegister)

router.post('/verify-otp', verifyOtp)

router.post("/login-user", userLogin)

router.get("/protected-route", verifyToken, async(req, res) => {
    res.send({message: "Successful"})
})

router.get('/all-user', verifyToken, checkPermissions(['super-admin']), getUser)

router.post("/add-item", verifyToken, checkPermissions(['admin']), addItem)



router.post("/remove-item",verifyToken, checkPermissions(['admin']), removeItem)

router.put("/update-item", verifyToken, checkPermissions(['admin']), updateItem)

router.get("/get-item", verifyToken, checkPermissions(['staff', 'admin']), getItem)

router.post("/add-order", verifyToken, checkPermissions(['staff']), newOrder)

router.delete("/delete-order", verifyToken, deleteOrder)

router.post("/upload-item-image", verifyToken, checkPermissions(['admin']),  upload.single('file'), uploadItemImage)

router.post("/get-monthly-order", verifyToken, checkPermissions(['super-admin']), monthWiseOrder)

router.post("/reset-password", verifyToken, checkPermissions(['super-admin']), resetPassword)

router.put("/change-role", verifyToken, checkPermissions(['super-admin']), updateRole)

router.post("/get-daily-order", verifyToken, checkPermissions(['super-admin']), dailyOrder)

router.post("/add-category", verifyToken, checkPermissions(['admin']), upload.single('file'), addCategory)

router.delete("/delete-category", verifyToken, checkPermissions(['admin']), deleteCategory)

router.get("/get-category", verifyToken, checkPermissions(['staff', 'admin']), getCategory)

module.exports = router
