module.exports.createAccount = (req,res,next) =>{
    if (!req.body.fullName){
        req.flash('warning','Thông tin họ và tên còn thiếu!');
        res.redirect('back');
        return;
    }
    for (let i = 0; i < req.body.fullName.length; i++) {
        let char = req.body.phone[i];
        if (!((char >= 'a' && char <= 'z') || (char >='A' && char <= 'Z'))) {
            req.flash('warning', 'Họ và tên không hợp lệ!');
            res.redirect('back');
            return;
        }
    }
    
    if (!req.body.phone){
        req.flash('warning','Thông tin số điên thoại còn thiếu!');
        res.redirect('back');
        return;
    }
    for (let i = 0; i < req.body.phone.length; i++) {
        if (isNaN(req.body.phone[i])) {
            req.flash('warning', 'Thông tin số điện thoại không hợp lệ!');
            res.redirect('back');
            return;
        }
    }
    

    if (!req.body.email){
        req.flash('warning','Thông tin email còn thiếu!');
        res.redirect('back');
        return;
    }
    if (!req.body.password){
        req.flash('warning','Password còn thiếu!');
        res.redirect('back');
        return;
    }
    next();

}

module.exports.editAccount = (req,res,next) =>{
    if (!req.body.fullName){
        req.flash('warning','Thông tin họ và tên còn thiếu!');
        res.redirect('back');
        return;
    }
    for (let i = 0; i < req.body.fullName.length; i++) {
        let char = req.body.phone[i];
        if (!((char >= 'a' && char <= 'z') || (char >='A' && char <= 'Z'))) {
            req.flash('warning', 'Họ và tên không hợp lệ!');
            res.redirect('back');
            return;
        }
    }
    
    if (!req.body.phone){
        req.flash('warning','Thông tin số điên thoại còn thiếu!');
        res.redirect('back');
        return;
    }
    for (let i = 0; i < req.body.phone.length; i++) {
        if (isNaN(req.body.phone[i])) {
            req.flash('warning', 'Thông tin số điện thoại không hợp lệ!');
            res.redirect('back');
            return;
        }
    }
    

    if (!req.body.email){
        req.flash('warning','Thông tin email còn thiếu!');
        res.redirect('back');
        return;
    }
    next();

}