const { default: mongoose } = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        user_id : String,
        content : String,
        room_chat_id : String,
        images : Array,
        deleted : {
            type : Boolean,
            default : false
        },
        deleteAt : Date
    }, { timestamps: true }
)
const Chat = mongoose.model("Chat",chatSchema,"chats");

module.exports = Chat;