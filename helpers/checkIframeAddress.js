const validator = require('validator'); // Kiểm tra URL

// Hàm để lấy URL từ chuỗi iframe
function extractURLFromIframe(iframeString) {
    const regex = /src="([^"]+)"/;
    const match = iframeString.match(regex);
    return match ? match[1] : null; // Trả về URL nếu tìm thấy
}

// Hàm kiểm tra tính hợp lệ của URL
function isValidURL(iframeString) {
    const url = extractURLFromIframe(iframeString);
    return url && validator.isURL(url); // Kiểm tra nếu URL hợp lệ
}

// Hàm kiểm tra URL trong iframe
function validateIframeURL(iframeString) {
    if (!isValidURL(iframeString)) {
        return false; // Địa chỉ không hợp lệ
    }
    
    const url = extractURLFromIframe(iframeString);
    
    // Kiểm tra xem URL có phải là Google Maps không
    if (url.includes('google.com/maps/embed')) {
        return true; // URL hợp lệ cho Google Maps
    }
    return false; // URL không hợp lệ
}

module.exports = validateIframeURL;
