const Item = require('../schema/items')

const existItem = async(itemName) => {
    let item = await Item.findOne({itemName})
    return item
}

const newItem = async(itemDetail, res) => {
    const item = new Item({
        ...itemDetail
    })
    console.log(item);
    const resp = await item.save();
    console.log(resp);
    return res.status(200).json({
        message: "Item added",
        success: true 
    })
}

const addItem = async(itemDetail, res) => {
    const itemExist = await Item.findOne({itemName: itemDetail.itemName})
    if(itemExist){
        await itemExist.updateOne({totalQuantity: itemExist.totalQuantity+itemDetail.totalQuantity})
        return res.status(200).json({
            message: "Items added",
            success: true 
        })
    }
    else{
       await newItem(itemDetail, res)
    }
}

const deleteItem = async(itemDetail, res) => {
    const itemExist = await Item.findOne({itemName: itemDetail.itemName})
    if(itemExist){
        await itemExist.deleteOne(itemExist._id)
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

const removeItem = async(itemDetail, res) => {
    const itemExist = await Item.findOne({itemName: itemDetail.itemName})
    if(itemExist){
        await itemExist.updateOne({totalQuantity: itemExist.totalQuantity-itemDetail.totalQuantity})
        return res.status(200).json({
            message: "Items removed successfully",
            success: true 
        })
    }
    return res.status(404).json({
        message: "Item not found",
        success: false 
    })
}

const updateItem = async(itemDetail, res) => {
    const itemExist = await existItem(itemDetail.itemName)
    if(itemExist){
        await itemExist.updateOne({category: itemDetail.category, MRP: itemDetail.MRP, totalQuantity: itemDetail.totalQuantity})
        return res.status(200).json({
            message: "Items removed successfully",
            success: true 
        })
    }
    return res.status(404).json({
        message: "Item not found",
        success: false 
    })
}

module.exports = {addItem, deleteItem, removeItem, updateItem}