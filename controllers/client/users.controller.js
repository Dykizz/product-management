const ClientAccount = require('../../models/client-account.model');
const RoomChat = require('../../models/room-chat.model');
const usersSocket = require('../../socket/client/users.socket');


module.exports.notFriend = async (req, res) => {
    await usersSocket(req,res);
    const userID = res.locals.account._id;
    const myUser = await ClientAccount.findOne({_id : userID });
    // const friends = myUser.friends.map(ob => ob.user_id);
    // const sendFriend = myUser.sendFriend;
    const notFriends = await ClientAccount.find({
        $and: [
            { _id: { $ne: userID } },
            { _id: { $nin: myUser.friends?.map(ob => ob.user_id) } },
            { _id: { $nin: myUser.sendFriend } }
        ],
        status: "active",
        deleted: false
    }, "username thumbnail gender");
    // console.log(myUser)
    res.render('client/pages/users/not-friend.pug', {
        pageTitle: "Danh sách người dùng",
        users: notFriends,
        friendsLength : myUser.friends.length,
        sendFriendLength : myUser.sendFriend.length,
        requestFriendLength : myUser.requestFriend.length
    });
}

module.exports.sendFriend = async (req, res) => {
    await usersSocket(req,res);
    const userID = res.locals.account._id;
    const myUser = await ClientAccount.findOne({_id : userID });
    // const sendFriend = myUser.sendFriend;
    const sendFriends = await ClientAccount.find({
        _id: { $in: myUser.sendFriend },
        status: "active",
        deleted: false
    }, "username thumbnail gender");
    res.render('client/pages/users/send-friend.pug', {
        pageTitle: "Lời mời đã gửi",
        users: sendFriends,
        friendsLength : myUser.friends.length,
        sendFriendLength : myUser.sendFriend.length,
        requestFriendLength : myUser.requestFriend.length
    });

}

module.exports.requestFriend = async (req,res) => {
    await usersSocket(req,res);
    const userID = res.locals.account._id;
    const myUser = await ClientAccount.findOne({_id : userID },"-password");
    const requestFriends = await ClientAccount.find({
        _id : { $in : myUser.requestFriend },
        status : "active",
        deleted : false
    });
    res.render('client/pages/users/request-friend.pug', {
        pageTitle: "Lời mời kết bạn",
        users: requestFriends,
        friendsLength : myUser.friends.length,
        sendFriendLength : myUser.sendFriend.length,
        requestFriendLength : myUser.requestFriend.length
    });
}

module.exports.friends = async (req,res) => {
    await usersSocket(req,res);
    const userID = res.locals.account._id;
    const myUser = await ClientAccount.findOne({_id : userID });
    const listFriend = await ClientAccount.find({
        _id : { $in : myUser.friends?.map(ob => ob.user_id) },
        deleted : false,
        status : "active"
    });
    // Thêm room_id
    myUser.friends.forEach((data,index) => {
        listFriend[index].room_chat_id = data.room_chat_id;
    });
    

    res.render('client/pages/users/friends.pug',{
        pageTitle : "Danh sách bạn bè",
        users : listFriend,
        friendsLength : myUser.friends.length,
        sendFriendLength : myUser.sendFriend.length,
        requestFriendLength : myUser.requestFriend.length
    })
}

