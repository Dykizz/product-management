const { default: mongoose } = require("mongoose");
const generate = require('../helpers/genarate');
const accountSchema = new mongoose.Schema(
    {
        email : String,
        username : String,
        password : String,
        online : {
            type : Boolean,
            default : false
        },
        gender : {
            type : String,
            default : "male"
        },
        friends : [{
            user_id : String,
            room_chat_id : String
        }],
        requestFriend : {
            type : Array,
            default : []
        },
        sendFriend : {
            type : Array,
            default : []
        },
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
        },
        deleted : {
            type : Boolean,
            default : false
        }
    }, { timestamps: true }
)
const ClientAccount = mongoose.model("clientaacount",accountSchema,"clientaccount");

module.exports = ClientAccount;