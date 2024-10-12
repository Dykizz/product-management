const uploadToCloudDinary = require('../../helpers/uploadToCloudDinary');

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


const uploadImage = async (req, res, next) => {
    if (req.file) {
        const url  = await uploadToCloudDinary(req.file.buffer);
        if (!url){
            req.flash('danger','Lỗi upload hình ảnh');
            return res.redirect('back');
        }
        req.body[req.file.fieldname] = url ;
    }
    next();
    
}
module.exports = uploadImage;