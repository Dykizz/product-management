const Product = require("../../models/product.model")
// [GET] /products
module.exports.index = async (req,res) => {
    const products = await Product.find({
        status : "active",
        deleted : false
    }).sort({position : "desc"});
    const newProduct =  products.map(item => {
        item.priceNew = Math.floor(item.price*(100 - item.discountPercentage)/100);
        return item;
    });
    console.log(newProduct);
    res.render('client/pages/products/index',{
        pageTitle : "Sản phẩm",
        products : newProduct
    })
}