const Account = require('../../models/account.model');
const ClientAccount = require('../../models/client-account.model');
const Product = require('../../models/product.model');
const Category = require('../../models/categories.model');
// [GET] /admin/dashboard

module.exports.dashboard = async (req,res) => {
    try {
        const countAccount = await Account.countDocuments({});
        const countActiveAccount = await Account.countDocuments({status : "active"});
        const countClient = await ClientAccount.countDocuments({});
        const countActiveClient = await ClientAccount.countDocuments({status : "active"});
        const countProduct = await Product.countDocuments({});
        const countActiveProduct = await Product.countDocuments({status : "active"});
        const countCategory = await Category.countDocuments({});
        const countActiveCategory = await Category.countDocuments({status : "active"});

        const infor = {
            accountAdmin : {
                total : countAccount,
                active : countActiveAccount,
                inactive : countAccount - countActiveAccount
            },
            accountClient : {
                total : countClient,
                active : countActiveClient,
                inactive : countClient - countActiveClient
            },
            product : {
                total : countProduct,
                active : countActiveProduct,
                inactive : countProduct - countActiveProduct
            },
            category : {
                total : countCategory,
                active : countActiveCategory,
                inactive : countCategory - countActiveCategory
            }
        }

        res.render("admin/pages/dashboard/index",{
            pageTitle : "Tổng quan",
            infor : infor
        })
    } catch (error) {
        console.log(error);
        req.flash('danger','Có lỗi xảy ra!');
        return res.render('back');
    }
}