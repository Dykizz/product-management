const RoomChat = require('../../models/room-chat.model');
module.exports = async (req,res,next) => {
    const room_chat_id = req.params.id;
    try {
        const existRoom = await RoomChat.findOne({_id : room_chat_id });
        if (existRoom) next();
        else res.redirect('/');
    } catch (error) {
        res.redirect('/');
    }
}