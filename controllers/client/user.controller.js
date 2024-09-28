const ClientAccount = require('../../models/client-account.model');
const ForgetAccount = require('../../models/forget-account.model')
const md5 = require('md5');
const { use } = require('../../routers/client/user.router');


// [GET] user/login
module.exports.login = (req,res) => {
    res.render('client/pages/user/login.pug',{
        pageTitle : 'Đăng nhập'
    })
}

// [POST] /user/login
module.exports.loginPost = async (req,res) => {
    let {email , password } = req.body;
    password = md5(password);
    const account = await ClientAccount.findOne({ email : email, password : password});
    if (!account) {
        req.flash('danger','Tài khoản hoặc mật khẩu không chính xác!');
        res.redirect('back');
    }else if (account.status != "active"){
        req.flash('danger','Tài khoản của bạn hiện đang bị khóa!');
        res.redirect('back');
    }
    else{
        res.cookie('token',account.token);
        req.flash('success','Đăng nhập tài khoản thành công!');
        res.redirect('/');
    }
}
// [GET] /user/logout
module.exports.logout = (req,res) => {
    res.clearCookie('token');
    req.flash('success','Đăng xuất tài khoản thành công!');
    res.redirect('/');
}

// [GET] /user/register
module.exports.register = (req,res) => {
    res.render('client/pages/user/register.pug',{
        pageTitle : 'Đăng kí'
    })
}

// [POST] /user/register 
module.exports.registerPost = async (req,res) => {
    try{
        let {email , username , password , repassword} = req.body;
        if (!email || !username || !password || !repassword) {
            req.flash('warning','Thông tin điền vào còn thiếu!')
            return res.redirect('back');    
        }
        if (password != repassword){
            req.flash('danger','Mật khẩu không trùng khớp!')
            return res.redirect('back');
        }
        const checkExistEmail = await ClientAccount.findOne({email : email },"-password");
        if (checkExistEmail){
            req.flash('danger','Email này đã được đăng kí!');
            return res.redirect('back');
        }
        const checkExistUsername =  await ClientAccount.findOne({username : username},"-password");
        if (checkExistUsername){
            req.flash('danger','Tên tài khoản này đã được đăng kí!');
            return res.redirect('back');
        }
        delete req.body.repassword;
        req.body.password = md5(req.body.password);
        const newAccount = new ClientAccount(req.body);
        newAccount.save();
        req.flash('success','Tạo tài khoản thành công. Hướng đến trang đăng nhập!');
        res.redirect('/user/login');
    }catch(error){
        console.log(error);
        req.flash('danger','Lỗi đăng nhập!')
        res.redirect('back');
    }

}

// [GET] user/forget
module.exports.forget = (req,res) => {
    res.render('client/pages/user/forget',{
        pageTitle : "Lấy lại mật khẩu"
    })
}

// [POST] user/forget
module.exports.forgetPost = async (req,res) =>{
    const { email } = req.body;
    if (!email){
        req.flash('dangger','Bạn chưa điền email!');
        return res.redirect('back');
    }

    const emailExits = await ClientAccount.findOne({email : email},"email status");

    if (!emailExits){
        req.flash('warning','Email này không tồn tại!');
        return res.redirect('back');
    }

    if (emailExits.status != "active"){
        req.flash('warning','Tài khoản này hiện đang khóa!'); 
        return res.redirect('back');
    }
    const expireTime = new Date(Date.now() + 180 * 1000); 
    const obforget = new ForgetAccount({email : email , expireAt : expireTime});

    await obforget.save();
    res.redirect(`/user/forget/comfirm-otp?email=${email}`);
  
}

// [GET] /forget/comfirm

module.exports.comfirmOTP = (req,res) => {
    const { email } = req.query;
    res.render('client/pages/user/comfirm-otp.pug',{
        pageTitle : "Nhập mã OTP",
        email : email
    });
}

// [POST] /forget/comfirm
module.exports.comfirmOTP_POST = async (req,res) => {
    const { email, otp } = req.body;

    const account = await ForgetAccount.findOne({email : email });
    if (!account){
        req.flash('danger','Mã OTP đã hết hiệu lực!');
        res.redirect('/user/forget');
    }
    if (account.otp != otp){
        req.flash('danger','Mã OTP không chính xác vui lòng thử lại!')
        return res.redirect('back');
    }

    const user = await ClientAccount.findOne({email : email},"token");

    res.cookie("tokenUser",user.token);

    res.redirect('/user/reset');


}