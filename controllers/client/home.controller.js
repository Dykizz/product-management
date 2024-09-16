const Categories = require('../../models/categories.model');
const Product = require('../../models/product.model');

// [GET] /
module.exports.index = async (req,res) => {
    const featuredProducts = await Product.find({ deleted : false , featured : true , status : "active"});
    res.render('client/pages/home/index',{
        pageTitle : "Trang chủ",
        products : featuredProducts
    })
}