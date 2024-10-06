
const Chat = require('../../models/chat.model');
const ClientAccount = require('../../models/client-account.model');
module.exports.index = async (req,res) => {
    if (!res.locals.account) {
        req.flash('danger','Yêu cầu đăng nhập để thực hiện tính năng chat!');
        return res.redirect('back');
    }
    const user_id = res.locals.account._id;
    const chats = await Chat.find({deleted : false });
    for (chat of chats){
        const inforUser = await ClientAccount.findOne({_id : chat.user_id},"username");
        chat.fullName = inforUser.username;
    }
    _io.once("connection", (socket) => {
        socket.on('CLIEN_SEND_MESS', async data => {
            const chat = new Chat({
                user_id : user_id,
                content : data.message
            });
            socket.emit('SERVER_RETURN_MESS',data);
            data.type = 'friend';
            socket.broadcast.emit('SERVER_RETURN_MESS', data);
            await chat.save();
        });
        socket.on('disconnect', () => {
            console.log("User disconnected");
        });
    });
    
    res.render('client/pages/chat/index.pug',{
        pageTitle : "Chat",
        user_id : user_id,
        chats : chats
    });
}