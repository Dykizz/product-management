import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js';
import { FileUploadWithPreview } from 'https://unpkg.com/file-upload-with-preview/dist/index.js';

// FileUploadWithPreview
const upload = new FileUploadWithPreview('upload-image',{
    multiple : true,
    maxFileCount : 6
});

// End FileUploadWithPreview

const socket = io();
const chatForm = document.querySelector('.chat-form');
const chatMess = document.querySelector('.chat-mess');
const buttonSend = document.querySelector('.send-mess');
const messages = document.querySelector('.messages');

// Hàm cuộn xuống dưới cùng của danh sách tin nhắn
const scrollToBottom = () => {
    messages.scrollTop = messages.scrollHeight;
};
scrollToBottom();

// Thông báo tin nhắn đang được tải (khi gửi hình)
const loadingNotification = document.createElement('li');
loadingNotification.classList.add('self');
loadingNotification.classList.add('chat-notifi');
loadingNotification.textContent = 'Tin nhắn của bạn đang được tải lên ...';
socket.on("SERVER_LOADING_MESS",_ =>{
    messages.appendChild(loadingNotification);
    scrollToBottom();
});

// Thêm tin nhắn vào khung chat
const addMessItems = (data,type) => {
    const fragment = document.createDocumentFragment();
    if (type == 'friend'){
        const name = document.createElement('li');
        name.innerHTML = `<strong>${data.username}</strong>`;
        fragment.appendChild(name);
    }
    
    if (data.message) {
        const chatItemMess = document.createElement('li');
        chatItemMess.classList.add(`${type}`);
        chatItemMess.innerHTML = `<div class="mess-item">${data.message}</div>`;
        fragment.appendChild(chatItemMess);
    }
    
    if (data.images.length > 0) {
        if (loadingNotification) messages.removeChild(loadingNotification);
        const chatItemImages = document.createElement('li');
        chatItemImages.classList.add(`${type}`);
        let imagesHTML = `<div class="image-item">`;
        for (const imageUrl of data.images) {
            imagesHTML += `<img src="${imageUrl}"> </img>`;
        }
        imagesHTML += '</div>';
        chatItemImages.innerHTML = imagesHTML;
        fragment.appendChild(chatItemImages);
    }
    
    messages.appendChild(fragment);
    
    scrollToBottom();
}

buttonSend.addEventListener('click',()=>{
    chatForm.submit();
})
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = chatMess.value;
    const images = upload.cachedFileArray || [];
    if (message || images.length > 0){
        chatMess.value = '';
        upload.resetPreviewPanel();
        
        socket.emit('CLIENT_SEND_MESS', {
            message: message,
            images : images
        });
    }
});

// Hàm gửi thông báo người dùng đang nhập
let TypingIDs = [];
const sendUserTyping = (data) => {
    const exist = TypingIDs.find(id => id == data.user_id);
    if (!exist) {
        TypingIDs.push(data.user_id);
        const divFriend = document.createElement('li');
        divFriend.classList.add('friend');
        divFriend.setAttribute("id", data.user_id);
        divFriend.innerHTML = `<span class="user-send-typing">${data.fullName}</span>
            <div class="typing-indicator show">
                <span class="dot">
                    <svg class="svg-inline--fa fa-circle" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"></path></svg>
                </span>
                <span class="dot">
                    <svg class="svg-inline--fa fa-circle" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"></path></svg>
                </span>
                <span class="dot">
                    <svg class="svg-inline--fa fa-circle" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"></path></svg>
                </span>
            </div>`;
        
        const fragment = document.createDocumentFragment();
        fragment.appendChild(divFriend);
        messages.appendChild(fragment);
        scrollToBottom();
    }
};

// Hàm xóa thông báo người dùng đang nhập
const deleteUserTyping = (data) => {
    const element = document.getElementById(data.user_id);
    if (element) {
        messages.removeChild(element);
        TypingIDs = TypingIDs.filter(id => id != data.user_id);
    }
};

// Nhận và hiển thị tin nhắn từ server
socket.on('SERVER_RETURN_MESS', (data) => {
    deleteUserTyping(data);
    // addMessItems(data,type);
    addMessItems(data,data.type);
});

// Xử lý Popper
const buttonIcon = document.querySelector('.btn-icon.icon-emoji');
if (buttonIcon) {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        Popper.createPopper(buttonIcon, tooltip);
        buttonIcon.onclick = () => {
            tooltip.classList.toggle('shown');
        };
    }
}

// Hàm xử lý timeout gõ chữ
let typingTimeout;
const handleTypingTimeout = () => {
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        socket.emit('CLIENT_SEND_STOP_TYPING', {});
    }, 1500);
};

// Sự kiện chọn emoji
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
    emojiPicker.addEventListener("emoji-click", (event) => {
        socket.emit('CLIENT_SEND_TYPING', {});
        handleTypingTimeout();

        const icon = event.detail.unicode;
        chatMess.value += icon;

        const end = chatMess.value.length;
        chatMess.setSelectionRange(end, end);
        chatMess.focus();
    });
}

// Sự kiện khi người dùng nhập liệu
chatMess.addEventListener('input', () => {
    socket.emit('CLIENT_SEND_TYPING', {});
    handleTypingTimeout();
});

// Nhận thông báo người dùng khác đang gõ
socket.on('SERVER_RETURN_TYPING', (data) => {
    sendUserTyping(data);
});

// Nhận thông báo người dùng khác ngừng gõ
socket.on('SERVER_RETURN_STOP_TYPING', (data) => {
    deleteUserTyping(data);
});


