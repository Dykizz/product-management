const { default: mongoose } = require("mongoose");
const generate = require('../helpers/genarate');
const accountSchema = new mongoose.Schema(
    {
        fullName : String,
        email : String,
        avatar : String,
        password : String,
        token : {
            type : String,
            default : generate.randomToken(20)
        },
        phone : String,
        role_id : String,
        status : String,
        deleted: {
            type : Boolean,
            default : false
        },
        deleteAt : String
    }, { timestamps: true }
)
const Account = mongoose.model("Account",accountSchema,"accounts");

module.exports = Account;