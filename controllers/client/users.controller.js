const ClientAccount = require('../../models/client-account.model');
const RoomChat = require('../../models/room-chat.model');
const usersSocket = require('../../socket/client/users.socket');


module.exports.notFriend = async (req, res) => {
    await usersSocket(req, res);
    const userID = res.locals.account._id;
    const myUser = await ClientAccount.findOne({ _id: userID });
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
    res.render('client/pages/users/not-friend.pug', {
        pageTitle: "Danh sách người dùng",
        users: notFriends,
        friendsLength: myUser.friends.length,
        sendFriendLength: myUser.sendFriend.length,
        requestFriendLength: myUser.requestFriend.length
    });
}

module.exports.sendFriend = async (req, res) => {
    await usersSocket(req, res);
    const userID = res.locals.account._id;
    const myUser = await ClientAccount.findOne({ _id: userID });
    // const sendFriend = myUser.sendFriend;
    const sendFriends = await ClientAccount.find({
        _id: { $in: myUser.sendFriend },
        status: "active",
        deleted: false
    }, "username thumbnail gender");
    res.render('client/pages/users/send-friend.pug', {
        pageTitle: "Lời mời đã gửi",
        users: sendFriends,
        friendsLength: myUser.friends.length,
        sendFriendLength: myUser.sendFriend.length,
        requestFriendLength: myUser.requestFriend.length
    });

}

module.exports.requestFriend = async (req, res) => {
    await usersSocket(req, res);
    const userID = res.locals.account._id;
    const myUser = await ClientAccount.findOne({ _id: userID }, "-password");
    const requestFriends = await ClientAccount.find({
        _id: { $in: myUser.requestFriend },
        status: "active",
        deleted: false
    });
    res.render('client/pages/users/request-friend.pug', {
        pageTitle: "Lời mời kết bạn",
        users: requestFriends,
        friendsLength: myUser.friends.length,
        sendFriendLength: myUser.sendFriend.length,
        requestFriendLength: myUser.requestFriend.length
    });
}

module.exports.friends = async (req, res) => {
    await usersSocket(req, res);
    const userID = res.locals.account._id;
    const myUser = await ClientAccount.findOne({ _id: userID });
    const listFriend = await ClientAccount.find({
        _id: { $in: myUser.friends?.map(ob => ob.user_id) },
        deleted: false,
        status: "active"
    });
    // Thêm room_id
    myUser.friends.forEach((data, index) => {
        listFriend[index].room_chat_id = data.room_chat_id;
    });


    res.render('client/pages/users/friends.pug', {
        pageTitle: "Danh sách bạn bè",
        users: listFriend,
        friendsLength: myUser.friends.length,
        sendFriendLength: myUser.sendFriend.length,
        requestFriendLength: myUser.requestFriend.length
    })
}

module.exports.rooms_chat = async (req, res) => {
    const myUser = res.locals.account;
    const rooms_chat = await RoomChat.find({
        'users.user_id': myUser._id.toString(),
        type: "group",
        deleted: false
    });
    res.render('client/pages/users/rooms-chat.pug', {
        pageTitle: "Phòng chat",
        roomsChat: rooms_chat,
        friendsLength: myUser.friends.length,
        sendFriendLength: myUser.sendFriend.length,
        requestFriendLength: myUser.requestFriend.length
    });

}

module.exports.create_room_chat = async (req, res) => {
    const myUser = res.locals.account;
    let friends = [];
    for (user of myUser.friends) {
        const infor = await ClientAccount.findOne({ _id: user.user_id, deleted: false }, "username");
        friends.push(infor);
    }

    res.render('client/pages/users/create-room-chat.pug', {
        pageTitle: "Tạo phòng chat",
        friends: friends
    })
}

module.exports.create_room_chatPost = async (req, res) => {
    try {
        const { title, avarta, members } = req.body;
        const account = res.locals.account;
        let users = [{
            user_id: account._id.toString(),
            role: "superAdmin"
        }];
        if (Array.isArray(members)){
            for (id of members) {
                users.push({
                    user_id: id,
                    role: "member"
                })
            }
        }
        else {
            users.push({
                user_id: members,
                role: "member"
            })
        }
        const roomChat = new RoomChat({
            title: title,
            avarta: avarta,
            users: users,
            type: "group"
        });
        await roomChat.save();
        req.flash('success','Tạo phòng thành công!')
        res.redirect('/users/rooms-chat');
    } catch (error) {
        console.log(error);
        req.flash('danger','Tạo phòng không thành công!')
        res.redirect('back');
    }

}