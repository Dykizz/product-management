
module.exports.index = (req,res) => {
    io.on("connection", (socket) => {
        console.log("User connected");
    
        socket.on('on-chat', message => {
            socket.emit('user-chat',message);
            message.type = 'friend';
            socket.broadcast.emit('user-chat', message);
        });
        socket.on('disconnect', () => {
            console.log("User disconnected");
        });
    });
    
    res.render('client/pages/chat/index.pug',{
        pageTitle : "Chat"
    });
}