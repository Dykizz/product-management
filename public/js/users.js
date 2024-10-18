const socket = io();

const btnAddFriends = document.querySelectorAll("button[btn-add-friend]");
btnAddFriends.forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.getAttribute("btn-add-friend");
        const card = btn.closest(".card-user");
        card.classList.add("add-friend");
        socket.emit("CLIENT_ADD_FRIEND", {
            userID: id
        });
    })

});

const btnCancelFriends = document.querySelectorAll("button[btn-cancel-friend]");
btnCancelFriends.forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.getAttribute("btn-cancel-friend");
        const card = btn.closest(".card-user");
        card.classList.remove("add-friend");
        socket.emit("CLIENT_CANCEL_FRIEND", {
            userID: id
        });
    })
});

const btnAcceptFriends = document.querySelectorAll("button[btn-accept-friend]");
btnAcceptFriends.forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.getAttribute("btn-accept-friend");
        console.log(id)
        const card = btn.closest(".card-user");
        card.classList.add("friend");
        card.classList.remove("not-friend");
        socket.emit("CLIENT_ACCEPT_FRIEND", {
            userID: id
        });
    })
});


const btnAccepts = document.querySelectorAll("button[btn-accept-friend]");
btnAccepts.forEach(btn => {
    btn.addEventListener('click',() => {
        const id = btn.getAttribute("btn-accept-friend");
        const card = btn.closest(".card-user");
        // card.classList.add("friend");
        card.classList.remove("not-friend");
        socket.emit("CLIENT_ACCEPT_FRIEND")
    })
})

const btnCancelAccept = document.querySelectorAll("button[btn-cancel-accept]");
btnCancelAccept.forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.getAttribute("btn-cancel-accept");
        const card = btn.closest(".card-user");
        card.classList.add("d-none")
        socket.emit("CLIENT_CANCEL_ACCEPT", {
            userID: id
        });
    });
});

let btnUnfriends = document.querySelectorAll("button[btn-unfriend]");
btnUnfriends.forEach(btn => {
    btn.addEventListener("click", () => {
        const id = btn.getAttribute("btn-unfriend");
        const card = btn.closest(".card-user");
        card.classList.remove("friend");
        card.classList.add("not-friend");
        socket.emit("CLIENT_UNFRIEND", {
            userID: id
        });
    });
});
const updateQuantity = (data) => {
    const friend_button = document.getElementById(data.userID);
    if (friend_button) {
        const divSendFriend = friend_button.querySelector('.quantity[quantity-send]');
        const divRequestFriend = friend_button.querySelector('.quantity[quantity-request]');
        const divFriends = friend_button.querySelector('.quantity[quantity-friends]');
        divRequestFriend.textContent = data.requestFriendLength;
        divSendFriend.textContent = data.sendFriendLength;
        divFriends.textContent = data.friendsLength;

    }
}
socket.on("SERVER_RETURN_QUANTITY", data => updateQuantity(data));

socket.on("SERVER_RETURN_ONLINE", data => {
    const cards = document.querySelector(`.card-user[id = "${data.userID}"]`);
    if (cards){
        cards.setAttribute("online","true");
    }
});
socket.on("SERVER_RETURN_OFFLINE", data => {
    const cards = document.querySelector(`.card-user[id = "${data.userID}"]`);
    if (cards){
        cards.setAttribute("online","false");
    }
});
