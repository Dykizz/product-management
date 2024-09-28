const { default: mongoose } = require("mongoose");
const generate = require('../helpers/genarate');
const accountSchema = new mongoose.Schema(
    {
        email : String,
        username : String,
        password : String,
        token : {
            type : String,
            default : generate.randomToken(20)
        },
        thumbnail : {
            type : String,
            default : ''
        },
        status : {
            type : String,
            default : "active"
        }
    }, { timestamps: true }
)
const ClientAccount = mongoose.model("clientaacount",accountSchema,"clientaccount");

module.exports = ClientAccount;