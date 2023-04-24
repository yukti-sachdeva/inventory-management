const category = require('../schema/category')
const ErrorHandler=require("../utils/errorHandler")
const Item = require('../schema/items')

const cloudinary = require("cloudinary");
    cloudinary.config({
     cloud_name: process.env.CLOUD_NAME,
     api_key: process.env.CLOUD_API_KEY,
     api_secret: process.env.CLOUD_API_SECRET 
   });

const addCategory = async(req, res) => {
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
    //console.log(item.findOne);
    const {categoryName} = req.body
    console.log("categoryNAme---->",categoryName);
    const catResponse = await Item.findOneAndUpdate({category: categoryName}, {category: "Null"});
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
