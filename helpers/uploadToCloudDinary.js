const cloudinary = require('../config/cloudinary');

const streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'image' },
            (error, result) => {
                if (error) {
                    return reject({ error });
                }
                resolve({ url: result.secure_url });
            }
        );
        stream.end(buffer); // Sử dụng buffer từ bộ nhớ tạm thời để upload
    });
}
const uploadToCloudDinary = async (buffer) =>{
    const {url }= await streamUpload(buffer)
    return url;
}
module.exports = uploadToCloudDinary;