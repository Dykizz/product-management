const Product = require('../../models/product.model')
const filterStatusHelper = require('../../helpers/filteStatusHelper');
const searchHelper = require('../../helpers/searchHelper');
const paginationHelper = require('../../helpers/paginationHelper')
// [GET] /admin/products
module.exports.index = async (req,res) => {
    let find = {
        deleted : false
    }
    const filterStatus = filterStatusHelper(req.query);
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex){
        find.title = objectSearch.regex;
    }
    if (objectSearch.status){
        find.status = objectSearch.status;
    }

    const objectPagination = await paginationHelper(Product,find,req.query);
    const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skipItems);

    res.render("admin/pages/products/index",{
        pageTitle : "Danh sách sản phẩm",
        products : products,
        filterStatus : filterStatus,
        keyword : objectSearch.keyword,
        totalPage : objectPagination.totalPage,
        currentPage : objectPagination.currentPage
    })
}

// [PACTH] /admin/products/changeStatus/:status/:id
module.exports.changeStatus = async (req,res) => {
    const status = req.params.status;
    const id = req.params.id ;
    const currentStatus = status == "active" ? "inactive" : "active";
    await Product.updateOne({ _id : id},{status : currentStatus});
    res.redirect("back");
}