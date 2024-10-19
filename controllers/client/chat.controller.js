const ChatSocket = require('../../socket/client/chat.socket');
const Chat = require('../../models/chat.model');
const ClientAccount = require('../../models/client-account.model');
module.exports.index = async (req,res) => {
    if (!res.locals.account) {
        req.flash('danger','Yêu cầu đăng nhập để thực hiện tính năng chat!');
        return res.redirect('back');
    }
    const room_chat_id = req.params.id;
    const user_id = res.locals.account._id.toString();
    const chats = await Chat.find({
        room_chat_id : room_chat_id,
        deleted : false 
    });
    for (chat of chats){
        const inforUser = await ClientAccount.findOne({_id : chat.user_id},"username");
        chat.fullName = inforUser.username;
    }
    await ChatSocket(req,res);
    res.render('client/pages/chat/index.pug',{
        pageTitle : "Chat",
        user_id : user_id,
        chats : chats
    });
}