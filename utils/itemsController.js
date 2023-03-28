const Sale = require('../schema/sales')
const Item = require('../schema/items')

const existItem = async(itemName) => {
    let item = await Item.findOne({itemName})
    return item ? true : false 
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

module.exports = {addItem}