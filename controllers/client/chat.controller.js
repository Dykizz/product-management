const ChatSocket = require('../../socket/client/chat.socket');
const Chat = require('../../models/chat.model');
const RoomChat = require('../../models/room-chat.model');
const ClientAccount = require('../../models/client-account.model');
module.exports.index = async (req,res) => {
    if (!res.locals.account) {
        req.flash('danger','Yêu cầu đăng nhập để thực hiện tính năng chat!');
        return res.redirect('back');
    }
    const room_chat_id = req.params.id;
    const roomChat = await RoomChat.findOne({_id : room_chat_id ,deleted : false });
    let title = "";
    if (roomChat.type == "group"){
        title = roomChat.title;
    }else{
        if (roomChat.users[0].user_id != res.locals.account._id.toString()) {
            const infor = await ClientAccount.findOne({ _id : roomChat.users[0].user_id },"username").lean();
            title = infor.username;
        }else {
            const infor = await ClientAccount.findOne({ _id : roomChat.users[1].user_id },"username").lean();
            title = infor.username;
        }
    }
    const user_id = res.locals.account._id.toString();
    const chats = await Chat.find({
        room_chat_id : room_chat_id,
        deleted : false 
    });
    for (chat of chats){
        const inforUser = await ClientAccount.findOne({_id : chat.user_id},"username").lean();
        chat.fullName = inforUser.username;
    }
    await ChatSocket(req,res);
    res.render('client/pages/chat/index.pug',{
        pageTitle : "Chat",
        title : title,
        user_id : user_id,
        chats : chats
    });
}