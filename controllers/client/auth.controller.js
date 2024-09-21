const ClientAccount = require('../../models/client-account.model');
const md5 = require('md5');


// [GET] auth/login
module.exports.login = (req,res) => {
    res.render('client/pages/auth/login.pug',{
        pageTitle : 'Đăng nhập'
    })
}

// [POST] /auth/login
module.exports.loginPost = async (req,res) => {
    let {username , password } = req.body;
    password = md5(password);
    const account = await ClientAccount.findOne({ username : username, password : password});
    if (!account) {
        req.flash('danger','Tài khoản hoặc mật khẩu không chính xác!');
        res.redirect('back');
    }else{
        res.cookie('token',account.token);
        req.flash('success','Đăng nhập tài khoản thành công!');
        res.redirect('/');
    }
}
// [GET] /auth/logout
module.exports.logout = (req,res) => {
    res.clearCookie('token');
    req.flash('success','Đăng xuất tài khoản thành công!');
    res.redirect('/');
}

// [GET] /auth/register
module.exports.register = (req,res) => {
    res.render('client/pages/auth/register.pug',{
        pageTitle : 'Đăng kí'
    })
}

// [POST] /auth/register 
module.exports.registerPost = async (req,res) => {
    try{
        let {username , password , repassword} = req.body;
        if (!username || !password || !repassword) {
            return res.redirect('back');    
        }
        if (password != repassword){
            req.flash('danger','Mật khẩu không trùng khớp!')
            return res.redirect('back');
        }
        const checkExist = await ClientAccount.findOne({username : username , password : password});
        if (checkExist){
            req.flash('danger','Tài khoản này đã tồn tại!');
            return res.redirect('back');
        }
        delete req.body.repassword;
        req.body.password = md5(req.body.password);
        const newAccount = new ClientAccount(req.body);
        newAccount.save();
        req.flash('success','Tạo tài khoản thành công. Hướng đến trang đăng nhập!');
        res.redirect('/auth/login');
    }catch(error){
        console.log(error);
        req.flash('danger','Lỗi đăng nhập!')
        res.redirect('back');
    }
    

}