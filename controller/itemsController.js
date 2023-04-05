const Item = require('../schema/items')
const cloudinary = require("cloudinary");
    cloudinary.config({
     cloud_name: process.env.CLOUD_NAME,
     api_key: process.env.CLOUD_API_KEY,
     api_secret: process.env.CLOUD_API_SECRET 
   });

const existItem = async(itemName) => {
    let item = await Item.findOne({itemName})
    return item
}

const newItem = async(req, res) => {
    const userDetail = req.body
    const item = new Item({
        ...userDetail
    })
    console.log(item);
    const resp = await item.save();
    console.log(resp);
    return res.status(200).json({
        message: "Item added",
        success: true 
    })
}

const addItem = async(req, res) => {
    const itemExist = await Item.findOne({itemName: req.body.itemName})
    if(itemExist){
        await itemExist.updateOne({totalQuantity: itemExist.totalQuantity+itemDetail.totalQuantity})
        return res.status(200).json({
            message: "Items added",
            success: true 
        })
    }
    else{
       await newItem(req, res)
    }
}

const deleteItem = async(req, res) => {
    const itemExist = await Item.findOne({itemName: req.body.itemName})
    console.log("1111111", itemName)
    try{
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
    })}
    catch(error){
        console.log(error)
    }
}

const removeItem = async(req, res) => {
    const itemExist = await Item.findOne({itemName: req.body.itemName})
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

const updateItem = async(req, res) => {
    const itemDetail = req.body.itemDetail;
    console.log("entered......");
    const itemExist = await existItem(itemDetail.itemName)
    if(itemExist){
        await itemExist.updateOne({category: itemDetail.category, MRP: itemDetail.MRP, totalQuantity: itemDetail.totalQuantity})
        console.log(itemExist)
        return res.status(200).json({
            message: "Items updated successfully",
            success: true 
        })
    }
    return res.status(404).json({
        message: "Item not found",
        success: false 
    })
}

const uploadImage = async(req, res) => {

    const itemName = req.body.itemName
    console.log(req.file)

    console.log(itemName)
    const itemExist = await existItem(itemName)
    if(itemExist){
        cloudinary.uploader.upload(req.file.path, async result => {
            const filter = {itemName: itemName}
            const newDoc = {image: result.url}
            const rep = await Item.updateOne(filter,newDoc);
            console.log('db response',rep)
            return res.json({
                           success: true,
                           profile_url: result.url
                        })
        });
    }
    else{
        return res.json({
            message: "Item not found",
            success: false 
        })
    }
}

// existItem("fghj").then((data) => console.log(data)).catch(err => console.log(err))

module.exports = {addItem,existItem, deleteItem, removeItem, updateItem, uploadImage}