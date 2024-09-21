const ClientAccount = require('../../models/client-account.model');

module.exports.index = async (req,res,next) =>{
    const token = req.cookies.token;
    if (token){
        const account = await ClientAccount.findOne({token : token},"username thumbnail");
        res.locals.account = account;
    }
    next();
}