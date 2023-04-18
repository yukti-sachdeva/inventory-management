
const {Item} = require('../schema/items')
const Order = require('../schema/orders')
const {getMonthlyOrder, getDailyOrder} = require("../controller/salesController")
const ErrorHandler = require('../utils/errorHandler')
const dayjs = require('dayjs')

const newOrder = async(req, res, next) => {
    try {
        
    const orderDetails = req.body 
    const items = orderDetails.itemList
    console.log(items);
    let total = 0;
    let amount = 0
    for(const i of items) {
        total = total + i.quantity
        const item = await Item.findOne({itemName: i.itemName})
        if(!item){
         throw new ErrorHandler("no item found",404)
        }
    if(i.quantity > item.totalQuantity){
      throw new ErrorHandler("insufficient quantity", 412)
        
    }
        console.log("21>>>",orderDetails.itemList);
        i.itemId = item._id.toString()
        amount += item.MRP * i.quantity
        await item.updateOne({totalQuantity: item.totalQuantity - i.quantity})
    }
    orderDetails.totalItems = total 
    orderDetails.totalPrice = amount 
    console.log(amount)
    orderDetails["orderStatus"] = "pending"
    const order = await Order.create({...orderDetails, itemList: items})

    return res.status(200).json({
        ...order.toObject(),
        message: "Order made successfully",
        success: true 
    })
    

    } catch (error) {
        console.log("err>>", error.statusCode, error.message);
        next(error)
    }
}

const deleteOrder = async (req, res) => {
    const orderDetails = req.body
    const order = await Order.findById({_id:orderDetails.orderId})
    if(order){
        await order.deleteOne(order._id)
        return res.status(200).json({
            message: "Item deleted successfully",
            success: true 
        })
    }
    return res.status(404).json({
        message: "Item not found",
        success: false 
    })

}

const monthWiseOrder = async(req, res) => {
    const orderDetails = await getMonthlyOrder()
    return res.status(200).json({
        message: "Order Details....",
        orderDetails,
        success: true 
    })
}

const dailyOrder = async(req, res) => {
    const startDate = dayjs(req.body.date).startOf('day').toDate()
    const endDate = dayjs(req.body.date).endOf('day').toDate()
    const orderDetails = await getDailyOrder(startDate, endDate)
    return res.status(200).json({
        message: "Daily Orders...",
        orderDetails,
        success: true 
    })
}

//existItem("fghj").then((data) => console.log(data)).catch(err => console.log(err))

module.exports = {newOrder, deleteOrder, monthWiseOrder, dailyOrder}