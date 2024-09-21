const Product = require('../../models/product.model')
module.exports.search = async (req,res) => {
    const keyword = req.query.keyword;
    if (!keyword){
        res.redirect('back');
        return;
    }
    const regex = new RegExp(keyword,"i");
    const products = await Product.find({title : regex , deleted : false , status : "active"}) ;
    res.render('client/pages/search/index',{
        pageTitle : "Kết quả tìm kiếm",
        keyword : keyword,
        products : products
    })

    
}