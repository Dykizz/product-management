const Categories = require("../../models/categories.model");
const Product = require("../../models/product.model");
const searchHelper = require('../../helpers/searchHelper');
const paginationHelper = require('../../helpers/paginationHelper');
// [GET] /products
module.exports.index = async (req, res) => {
    let find = {
        status : "active",
        deleted : false
    }
    const objectPagination = await paginationHelper(Product, find, req.query,12);
    const products = await Product.find(find)
        .sort({ position: -1 })
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skipItems);
        
    const newProducts = products.map(item => {
        item.priceNew = Math.floor(item.price * (100 - item.discountPercentage) / 100);
        return item;
    });
    res.render('client/pages/products/index', {
        pageTitle: "Sản phẩm",
        products: newProducts,
        totalPage: objectPagination.totalPage,
        currentPage: objectPagination.currentPage
    })
}
// [GET] /products/:slug
module.exports.detail = async (req, res) => {
    try {
        const slug = req.params.slug;
        if(slug == "undefined"){
            req.flash('danger','Sản phẩm này chưa có slug!')
            res.redirect('back');
            console.log("ji")
            return;
        }
        let product = await Product.findOne({
            status: "active",
            deleted: false,
            slug: slug
        }); 
        if (!product) {
            req.flash('danger','Không tồn tại sản phẩm này!')
            return res.redirect('back');
        }
        const category = await Categories.findOne({_id : product.category_id });
        let stockInCart = {
            status : false,
            quantity : 1
        };
        if (res.locals.cart){
            res.locals.cart.products.forEach(ob => {
                if (ob.productId == product._id.toString()){
                    stockInCart.status = true;
                    stockInCart.quantity = ob.quantity;
                } 
            })
        }
        product.category = category;
        res.render('client/pages/products/detail', {
            pageTitle: "Chi tiết sản phẩm",
            product: product,
            stockInCart : stockInCart
        })

    } catch (error) {
        console.log(error);
        res.flash('danger','Lỗi link truy cập vui lòng thử lại sau!');
        res.redirect('back');
    }
    
}
// [GET] products/category/:slugCategory
module.exports.category = async (req,res) => {
    try {
        const slugCategory = req.params.slugCategory;
        const category = await Categories.findOne({ deleted : false ,status : "active" , slug : slugCategory });
        let IdCategories = [category._id] ;
        const categories = await Categories.find({ deleted : false , status : "active"});
        let indexStart = 0;
        while(indexStart < IdCategories.length){
            let n = IdCategories.length;
            for (let i = indexStart; i < n ; i++){
                for(categoryItem of categories){
                    if (IdCategories[i] == categoryItem.parent_id){
                        IdCategories.push(categoryItem._id);
                        break;
                    }
                }
            }
            indexStart = n;
        }
        let find = {
            deleted : false, 
            category_id : { $in : IdCategories }
        }
        const objectPagination = await paginationHelper(Product, find, req.query,12);
        const products = await Product.find({deleted : false, category_id : { $in : IdCategories }})
            .sort({ position : -1})
            .limit(objectPagination.limitItems)
            .skip(objectPagination.skipItems);

        res.render('client/pages/products/category',{
            pageTitle : category.title,
            products : products,
            totalPage: objectPagination.totalPage,
            currentPage: objectPagination.currentPage
        })
        
    } catch (error){
        console.log(error);
        req.flash('danger','Lỗi truy cập');
        res.redirect('back');
    }
}