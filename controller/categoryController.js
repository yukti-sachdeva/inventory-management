const category = require('../schema/category')
const ErrorHandler=require("../utils/errorHandler")
const item = require('../schema/items')

const cloudinary = require("cloudinary");
    cloudinary.config({
     cloud_name: process.env.CLOUD_NAME,
     api_key: process.env.CLOUD_API_KEY,
     api_secret: process.env.CLOUD_API_SECRET 
   });

const addCategory = async(req, res) => {
    console.log("12>>>>",req.body);
    const {categoryName,description} = req.body
    console.log(req.file)
    cloudinary.uploader.upload(req.file.path, async result => {
        await category.create({
            categoryName: categoryName,
            imageUrl: result.url ,
            description: description
        })
        return res.json({
                       success: true,
                       profile_url: result.url
                    })
    });
}

const deleteCategory = async(req, res) => {
    const {categoryName} = req.body
    //await item.findOneAndUpdate({categoryName: categoryName},{categoryName: "Null"})
    const categoryFound = await category.findOneAndDelete({categoryName: categoryName})
    if(!categoryFound){
        return res.status(404).json({
            message: "category not found",
            success: false 
        })
    }
    // const deleteCategory=
    return res.status(200).json({
        message: "Catgeory deleted successfully",
        success: true 
    })
}

const getCategory = async(req, res) => {
    const categories = await category.find({})
    return res.status(200).json({
        message: "Here are the categories..",
        categories: categories,
        success: true 
    })
}

module.exports = {addCategory, deleteCategory, getCategory}