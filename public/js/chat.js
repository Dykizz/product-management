const socket = io();

const chatForm = document.querySelector('.chat-form');
const chatMess = document.querySelector('.chat-mess');
const buttonSend = document.querySelector('.send-mess');
const messages = document.querySelector('.messages');

console.log(chatForm)
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = chatMess.value;
    if (!message) return;
    chatMess.value = '';

    socket.emit('on-chat', {
        type : 'self',
        data : message
    });
});

socket.on('user-chat',(message) => {
    const chatItem = document.createElement('li');
    chatItem.classList.add(`${message.type}`);
    chatItem.innerHTML = `<div class = "mess-item">${message.data}</div>`
    messages.appendChild(chatItem);
})
