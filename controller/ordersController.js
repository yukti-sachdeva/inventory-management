const errorHandler = require('error-handler')
const {Item} = require('../schema/items')
const Order = require('../schema/orders')


const newOrder = async(orderDetails, res) => {
    let order = new Order({...orderDetails})
    console.log(order)
    const items = order.itemList
    console.log(items);
    let total = 0;
    let amount = 0
    for(const i of items) {
        total = total + i._doc.quantity
        const item = await Item.findOne({itemName: i._doc.itemName})
        if(!item){
        throw new errorHandler("no item found",404)
        }
        console.log(item._doc.MRP)
        amount += item._doc.MRP * i._doc.quantity
        await item.updateOne({totalQuantity: item.totalQuantity - i._doc.quantity})
    }
    order.totalItems = total 
    order.totalPrice = amount 
    console.log(amount)
    await order.save()
    await order.updateOne({orderStatus: "pending"})
    return res.status(200).json({
        ...orderDetails,
        message: "Order made successfully",
        success: true 
    })
    
}

const deleteOrder = async (orderDetails, res) => {
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

//existItem("fghj").then((data) => console.log(data)).catch(err => console.log(err))

module.exports = {newOrder, deleteOrder}