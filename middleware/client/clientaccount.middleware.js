const ClientAccount = require('../../models/client-account.model');
const Cart = require('../../models/cart.model');
const SettingGeneral = require('../../models/setting-general.model');
module.exports.index = async (req,res,next) =>{
    try{
        const token = req.cookies.token;
        const setting = await SettingGeneral.findOne({});
        res.locals.setting = setting;
        if (token){
            const account = await ClientAccount.findOne({token : token},"_id username thumbnail");
            if (account) {
                const cart = await Cart.findOne({userId : account._id.toString()});
                res.locals.cart = cart;
                res.locals.account = account;
            }
        }
    }catch(error){
        console.log(error);
    }
    
    next();
}