const Categories = require("../../models/categories.model");
const Product = require("../../models/product.model")
// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({ position: "desc" });
    const newProduct = products.map(item => {
        item.priceNew = Math.floor(item.price * (100 - item.discountPercentage) / 100);
        return item;
    });
    res.render('client/pages/products/index', {
        pageTitle: "Sản phẩm",
        products: newProduct
    })
}
// [GET] /products/:slug
module.exports.detail = async (req, res) => {
    try {
        const slug = req.params.slug;
        let product = await Product.findOne({
            status: "active",
            deleted: false,
            slug: slug
        }); 
        if (!product) {
            req.redirect('back');
            return;
        }
        const category = await Categories.findOne({_id : product.category_id });
        product.category = category;
        res.render('client/pages/products/detail', {
            pageTitle: "Chi tiết sản phẩm",
            product: product
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
        const products = await Product.find({deleted : false, category_id : { $in : IdCategories }})
            .sort({ position : -1});
        res.render('client/pages/products/category',{
            pageTitle : category.title,
            products : products
        })
        
    } catch (error){
        console.log(error);
        req.flash('danger','Lỗi truy cập');
        res.redirect('back');
    }
}