const { default: mongoose } = require("mongoose");
const generate = require('../helpers/genarate');
const accountSchema = new mongoose.Schema(
    {
        username : String,
        password : String,
        token : {
            type : String,
            default : generate.randomToken(20)
        },
        thumbnail : {
            type : String,
            default : ''
        }
    }, { timestamps: true }
)
const ClientAccount = mongoose.model("clientaacount",accountSchema,"clientaccount");

module.exports = ClientAccount;