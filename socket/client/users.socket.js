const ClientAccount = require('../../models/client-account.model');
const RoomChat = require('../../models/room-chat.model');
const generate = require('../../helpers/genarate');

const severSendData = async (socket, myUser, data) => {
    const myID = myUser._id.toString();
    const accountUser = await ClientAccount.findOne({ _id: data.userID }, "requestFriend sendFriend friends").lean();
    socket.broadcast.emit("SERVER_RETURN_QUANTITY", {
        userID: data.userID,
        friendsLength: accountUser.friends.length,
        requestFriendLength: accountUser.requestFriend.length,
        sendFriendLength: accountUser.sendFriend.length,
    });
    socket.emit("SERVER_RETURN_QUANTITY", {
        userID: myID,
        friendsLength: accountUser.friends.length,
        requestFriendLength: myUser.requestFriend.length,
        sendFriendLength: myUser.sendFriend.length,
    });
}

module.exports = async (req, res) => {
    const myID = res.locals.account._id.toString();
    let myUser = await ClientAccount.findOne({ _id: myID }, "-password").lean();
    _io.once("connection", (socket) => {
        // Kết bạn
        socket.on("CLIENT_ADD_FRIEND", async (data) => {
            try {
                if (!data.userID) return;
                const exists = myUser.sendFriend.indexOf(data.userID);
                if (exists === -1) {
                    await ClientAccount.updateOne({ _id: myID }, { $push: { sendFriend: data.userID } });
                    await ClientAccount.updateOne({ _id: data.userID }, { $push: { requestFriend: myID } });

                    // Cập nhật trường sendFriend của myUser mà không load lại toàn bộ
                    myUser.sendFriend.push(data.userID);
                    // Phát thông báo cập nhật qua WebSocket
                    await severSendData(socket, myUser, data);
                }
            } catch (err) {
                console.error("Error in CLIENT_ADD_FRIEND:", err);
            }
        });

        // Hủy lời mời kết bạn
        socket.on("CLIENT_CANCEL_FRIEND", async (data) => {
            try {
                if (!data.userID) return;
                const exists = myUser.sendFriend.indexOf(data.userID);
                if (exists !== -1) {
                    await ClientAccount.updateOne({ _id: myID }, { $pull: { sendFriend: data.userID } });
                    await ClientAccount.updateOne({ _id: data.userID }, { $pull: { requestFriend: myID } });
                    // Cập nhật trường sendFriend của myUser mà không load lại toàn bộ
                    myUser.sendFriend = myUser.sendFriend.filter(id => id !== data.userID);

                    // Phát thông báo cập nhật qua WebSocket
                    await severSendData(socket, myUser, data);
                }
            } catch (err) {
                console.error("Error in CLIENT_CANCEL_FRIEND:", err);
            }
        });

        // Đồng ý kết bạn
        socket.on("CLIENT_ACCEPT_FRIEND", async (data) => {
            try {
                if (!data || !data.userID) return;
                const existFriend = myUser.friends.some(friend => friend.user_id === data.userID);
                const existRequest = myUser.requestFriend.includes(data.userID);
                if (!existFriend && existRequest) {
                    const roomChat = new RoomChat({
                        type: "friend",
                        users: [
                            {
                                user_id: myID,
                                role: "supperAdmin"
                            },
                            {
                                user_id: data.userID,
                                role: "supperAdmin"
                            }
                        ]
                    });
                    await roomChat.save();
                    await ClientAccount.updateOne(
                        { _id: myID },
                        { $push: { friends: { user_id: data.userID, room_chat_id: roomChat.id } }, $pull: { requestFriend: data.userID } }
                    );

                    await ClientAccount.updateOne(
                        { _id: data.userID },
                        { $push: { friends: { user_id: myID, room_chat_id: roomChat.id } }, $pull: { sendFriend: myID } }
                    );

                    // Cập nhật trường friends và requestFriend của myUser mà không load lại toàn bộ
                    myUser.friends.push({ user_id: data.userID, room_chat_id: roomChat.id });
                    myUser.requestFriend = myUser.requestFriend.filter(id => id !== data.userID);

                    await severSendData(socket, myUser, data);
                }
            } catch (err) {
                console.error("Error in CLIENT_ACCEPT_FRIEND:", err);
            }
        });

        // Hủy chấp nhận kết bạn
        socket.on("CLIENT_CANCEL_ACCEPT", async data => {
            if (!data.userID) return;
            try {
                const existRequest = myUser.requestFriend.includes(data.userID);
                if (existRequest) {
                    await ClientAccount.updateOne({ _id: myID }, { $pull: { requestFriend: data.userID } });
                    await ClientAccount.updateOne({ _id: data.userID }, { $pull: { sendFriend: myID } });
                    myUser.requestFriend = myUser.requestFriend.filter(id => id != data.userID);

                    await severSendData(socket, myUser, data);
                }
            } catch (error) {
                console.log("Error in CLIENT_CANCEL_ACCEPT");
            }
        })


        // Hủy kết bạn
        socket.on("CLIENT_UNFRIEND", async (data) => {
            try {
                if (!data.userID) return;

                const existFriend = myUser.friends.some(friend => friend.user_id === data.userID);
                if (existFriend) {
                    for (ob of myUser.friends) {
                        if (ob.user_id == data.userID) {
                            await RoomChat.updateOne({ _id: ob.room_chat_id }, { $set: { deleted: true } });
                            break;
                        }
                    }
                    await ClientAccount.updateOne({ _id: myID }, { $pull: { friends: { user_id: data.userID } } });
                    await ClientAccount.updateOne({ _id: data.userID }, { $pull: { friends: { user_id: myID } } });

                    // Cập nhật trường friends của myUser mà không load lại toàn bộ
                    myUser.friends = myUser.friends.filter(friend => friend.user_id !== data.userID);

                    await severSendData(socket, myUser, data);

                }
            } catch (err) {
                console.error("Error in CLIENT_UNFRIEND:", err);
            }
        });
    });
};
