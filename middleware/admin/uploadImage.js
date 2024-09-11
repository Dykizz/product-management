const cloudinary = require('../../config/cloudinary');

// const uploadImage = async (file) => {
//     return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//             { resource_type: 'image' },
//             (error, result) => {
//                 if (error) {
//                     return reject({ error });
//                 }
//                 resolve({ url: result.secure_url });
//             }
//         );
//         stream.end(file.buffer); // Sử dụng buffer từ bộ nhớ tạm thời để upload
//     });
// };
const uploadImage = (req, res, next) => {
    if (req.file) {
        const streamUpload = (file) => {
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
                stream.end(file.buffer); // Sử dụng buffer từ bộ nhớ tạm thời để upload
            });
        }
        const upload = async (file) =>{
            const { url ,error } = await streamUpload(file);
            if (error){
                req.flash('danger','Lỗi upload hình ảnh');
                return res.redirect('back');
            }
            req.body[req.file.fieldname] = url ;
            next();
        }
        upload(req.file);
    } else {
        next();
    }
}
module.exports = uploadImage;