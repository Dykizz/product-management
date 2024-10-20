const RoomChat = require('../../models/room-chat.model');

module.exports = async (req, res, next) => {
    const room_chat_id = req.params.id;
    const user_id = res.locals.account.id;

    try {
        // Truy vấn kiểm tra xem có phòng không và user có trong danh sách không
        const room = await RoomChat.findOne({
            _id: room_chat_id,
            deleted: false,
            'users.user_id': user_id  // Kiểm tra trong mảng users có user_id mong muốn
        });

        if (room) {
            next();  // Nếu phòng tồn tại và user có trong phòng, tiếp tục
        } else {
            res.redirect('/');  // Nếu không, redirect về trang chủ
        }

    } catch (error) {
        console.error(`Error fetching room chat: ${error.message}`);
        res.redirect('/');
    }
};
