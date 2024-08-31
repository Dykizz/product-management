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
        product.priceNew = Math.floor(product.price * (100 - product.discountPercentage) / 100);
        res.render('client/pages/products/detail', {
            pageTitle: "Chi tiết sản phẩm",
            product: product
        })

    } catch (error) {
        res.flash('danger','Lỗi link truy cập vui lòng thử lại sau!');
        res.redirect('back');
    }
    
}