const configSystem = require('../../config/system');
const Account = require('../../models/account.model');
const Roles = require('../../models/roles.model');
module.exports.requireAuth = async (req,res,next) => {
    const { token } = req.cookies ;
    if (!token) {
        return res.redirect(`${configSystem.prefixAdmin}/auth/login`);
    }
    const account = await Account.findOne({ token : token }).select("-password");
    if (!account){
        return res.redirect(`${configSystem.prefixAdmin}/auth/login`);
    }
    const role = await Roles.findOne({ _id : account.role_id , deleted : false }).select("title permissions");
    
    res.locals.user = account;
    res.locals.role = role;
    next();
}