
const {Item } = require('../schema/items')
const ErrorHandler=require("../utils/errorHandler")
const findOrder = require('../controller/salesController')
const category = require('../schema/category')

const cloudinary = require("cloudinary");
    cloudinary.config({
     cloud_name: process.env.CLOUD_NAME,
     api_key: process.env.CLOUD_API_KEY,
     api_secret: process.env.CLOUD_API_SECRET 
   });

const existItem = async(name) => {
    let item = await Item.findOne({itemName:name})
    return item
}

const existCategory = async(categoryName) => {
    let category = await Item.findOne({category: categoryName})
    return category 
}

const newItem = async(req, res) => {
    const itemDetail = req.body
    const item = new Item({
        ...itemDetail
    })
    const categoryFound = await category.findOne({categoryName: itemDetail.category})
    if(!categoryFound){
        return res.status(404).json({
            message: "Category does not exist",
            success: false
        })
    }
    await item.save();
    return res.status(200).json({
        message: "Item added",
        success: true 
    })
}

const addItem = async(req, res) => {
    const itemDetail = req.body 
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
    itemName = req.body.itemName
    const itemExist = await Item.findOne({itemName: itemName})
    console.log("1111111", itemName)
    try{
    if(itemExist){
        await itemExist.deleteOne(itemExist._id)
        return res.status(200).json({
            message: "Item deleted successfully",
            success: true 
        })
    }
   throw new ErrorHandler("No item found",404)
    
}
catch(error){
    console.log(error)
}
}
const removeItem = async(req, res) => {
    const itemDetail = req.body
    const itemExist = await Item.findOne({itemName: req.body.itemName})
    try{
    if(itemExist){
        await itemExist.updateOne({totalQuantity: itemExist.totalQuantity-itemDetail.totalQuantity})
        return res.status(200).json({
            message: "Items removed successfully",
            success: true 
        })
    }
    throw new ErrorHandler("No item found",404)
    }
    catch(error){
        console.log(error)
    }

}

const updateItem = async(req, res) => {
    const itemDetail = req.body;
    console.log("entered......");
    const itemExist = await Item.findById({_id: itemDetail._id})
    if(itemExist){
        await itemExist.updateOne({itemName: itemDetail.itemName, category: itemDetail.category, MRP: itemDetail.MRP, totalQuantity: itemDetail.totalQuantity})
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

const getItem = async(req, res) => {
    // return res.send("hello")
    const itemCategory = req.query
    const itemExist = await existCategory(itemCategory.category)
    console.log()
    
    if(itemExist) {
        const items = await Item.find({category: itemCategory.category})
        //console.log(">>>> ",items);
        return res.status(200).json({
            message: "Item is found",
            items,
            success: true 
        })
    }
    return res.status(404).json({
        message: "Not found",
        success: false 
    })
}

const uploadItemImage = async(req, res) => {

    const itemName = req.body.itemName
    console.log(req.file)

    //console.log(itemName)
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

module.exports = {addItem,existItem, deleteItem, removeItem, updateItem, getItem,  uploadItemImage}