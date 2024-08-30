module.exports.createPost = (req,res,next) =>{
    if (req.body.title.length == 0){
        res.flash('warning','Hãy nhập tiêu đề sản phẩm!');
        res.redirect("back");
        return;
    }
    if (!req.body.price ){
        res.flash('warning','Hãy nhập giá sản phẩm!');
        res.redirect("back");
        return;
    }

    next();
}