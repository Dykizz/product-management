module.exports.randomToken = (length) => {
    const keys = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let token = "";
    for (let i = 0; i < length; i++) {
        token += keys[Math.floor(Math.random() * keys.length)];
    }
    return token;
}
