const Order = require('../schema/orders')

const newOrder = async(orderDetails, res) => {
    const order = new Order({...orderDetails})
    await order.save()
    await order.updateOne({orderStatus: "pending"})
    return res.status(200).json({
        ...orderDetails,
        message: "Order made successfully",
        success: true 
    })
    
}

const deleteOrder = async(orderDetails, res) => {
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

module.exports = {newOrder, deleteOrder}