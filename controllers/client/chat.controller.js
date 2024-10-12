
const Chat = require('../../models/chat.model');
const ClientAccount = require('../../models/client-account.model');
const uploadToCloudDinary = require('../../helpers/uploadToCloudDinary');
module.exports.index = async (req,res) => {
    if (!res.locals.account) {
        req.flash('danger','Yêu cầu đăng nhập để thực hiện tính năng chat!');
        return res.redirect('back');
    }
    const user_id = res.locals.account._id.toString();
    const username = res.locals.account.username;
    const chats = await Chat.find({deleted : false });
    for (chat of chats){
        const inforUser = await ClientAccount.findOne({_id : chat.user_id},"username");
        chat.fullName = inforUser.username;
    }
    _io.once("connection", (socket) => {
        socket.on('CLIENT_SEND_MESS', async data => {
            if (data.images.length > 0){
                socket.emit("SERVER_LOADING_MESS");
                const images = await Promise.all(
                    data.images.map(imageBuffer => uploadToCloudDinary(imageBuffer))
                ) || [];
                
                data.images = images;
            }
            
            const chat = new Chat({
                user_id: user_id,
                content: data.message,
                images: data.images
            });
            
            const selfData = { ...data, type: 'self' };
            socket.emit('SERVER_RETURN_MESS', selfData);
        
            const broadcastData = 
            { ...data, 
                username : username, 
                type: 'friend' };
            socket.broadcast.emit('SERVER_RETURN_MESS', broadcastData);

            // _io.emit('SERVER_RETURN_MESS',data);
            await chat.save();
            
        });

        socket.on('CLIENT_SEND_TYPING', data => {
            socket.broadcast.emit('SERVER_RETURN_TYPING',{
                user_id : user_id,
                fullName : res.locals.account.username
            })
        });

        socket.on('CLIENT_SEND_STOP_TYPING', data => {
            socket.broadcast.emit('SERVER_RETURN_STOP_TYPING',{
                user_id : user_id
            });
        })

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