const moongose = require('mongoose');

const roomChatSchema = new moongose.Schema({
    title: String,
    theme: String,
    avarta : String,
    type : String,
    users : [
        {
            user_id : String,
            role : String
        }
    ],
    deleted: {
        type: Boolean,
        default: false
    },
    deleteAt: Date
});

const Roles = moongose.model('RoomChat', roomChatSchema , 'room-chat');

module.exports = Roles;