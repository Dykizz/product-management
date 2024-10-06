import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'


const socket = io();

const chatForm = document.querySelector('.chat-form');
const chatMess = document.querySelector('.chat-mess');
const buttonSend = document.querySelector('.send-mess');
const messages = document.querySelector('.messages');

messages.scrollTop = messages.scrollHeight;
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = chatMess.value;
    if (!message) return;
    chatMess.value = '';

    socket.emit('CLIEN_SEND_MESS', {
        type : 'self',
        message : message
    });
});

socket.on('SERVER_RETURN_MESS',(data) => {
    const chatItem = document.createElement('li');
    chatItem.classList.add(`${data.type}`);
    chatItem.innerHTML = `<div class = "mess-item">${data.message}</div>`
    messages.appendChild(chatItem);
    messages.scrollTop = messages.scrollHeight; // Cho thanh cuộn trượt xuống mỗi khi nhắn
})

const buttonIcon = document.querySelector('.btn-icon')
if (buttonIcon){
  const tooltip = document.querySelector('.tooltip')
  Popper.createPopper(buttonIcon, tooltip)
  document.querySelector('.btn-icon').onclick = () => {
    tooltip.classList.toggle('shown');
  }
}

const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker){
    emojiPicker.addEventListener("emoji-click",(event)=> {
        const icon = event.detail.unicode;
        chatMess.value += icon;
    });
}