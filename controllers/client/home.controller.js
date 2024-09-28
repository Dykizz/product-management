const Categories = require('../../models/categories.model');
const Product = require('../../models/product.model');
const paginationHelper = require('../../helpers/paginationHelper');
// [GET] /
module.exports.index = async (req,res) => {
    let find = {
        deleted : false , 
        featured : true , 
        status : "active"
    }
    const objectPagination = await paginationHelper(Product, find, req.query,9);
    const featuredProducts = await Product.find(find)
        .sort({ position: -1 })
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skipItems);
    res.render('client/pages/home/index',{
        pageTitle : "Trang chủ",
        products : featuredProducts,
        totalPage: objectPagination.totalPage,
        currentPage: objectPagination.currentPage
    })
}