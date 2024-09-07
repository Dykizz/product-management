module.exports.createAccount = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash('warning', 'Thông tin họ và tên còn thiếu!');
        res.redirect('back');
        return;
    }
    const validFullName = /^[\p{L}\s]+$/u.test(req.body.fullName);

    if (!validFullName) {
        req.flash('warning', `Họ và tên không hợp lệ! ${validFullName}`);
        return res.redirect('back'); 
    }

    if (!req.body.phone) {
        req.flash('warning', 'Thông tin số điên thoại còn thiếu!');
        return res.redirect('back');
    }
    for (let i = 0; i < req.body.phone.length; i++) {
        if (isNaN(req.body.phone[i])) {
            req.flash('warning', 'Thông tin số điện thoại không hợp lệ!');
            return res.redirect('back');
        }
    }

    if (!req.body.email) {
        req.flash('warning', 'Thông tin email còn thiếu!');
        return res.redirect('back');
    }
    if (!req.body.password) {
        req.flash('warning', 'Password còn thiếu!');
        return res.redirect('back');
    }
    next();

}

module.exports.editAccount = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash('warning', 'Thông tin họ và tên còn thiếu!');
        return res.redirect('back');
    }
    const validFullName = /^[\p{L}\s]+$/u.test(req.body.fullName);

    if (!validFullName) {
        req.flash('warning', `Họ và tên không hợp lệ! ${validFullName}`);
        return res.redirect('back'); 
    }

    if (!req.body.phone) {
        req.flash('warning', 'Thông tin số điên thoại còn thiếu!');
        return res.redirect('back');
    }
    for (let i = 0; i < req.body.phone.length; i++) {
        if (isNaN(req.body.phone[i])) {
            req.flash('warning', 'Thông tin số điện thoại không hợp lệ!');
            return res.redirect('back');
        }
    }

    if (!req.body.email) {
        req.flash('warning', 'Thông tin email còn thiếu!');
        return res.redirect('back');
    }
    next();

}