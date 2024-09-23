const Cart = require('../../models/cart.model');
const ClientAccount = require('../../models/client-account.model');
const Product = require('../../models/product.model');

module.exports.addProduct = async (req, res) => {
    try{
        const { productId, stock } = req.body;
        
        // Lấy user từ token trong cookies
        const user = await ClientAccount.findOne({ token: req.cookies.token });
        if (!user) {
            req.flash('warning','Hãy đăng nhập để thực hiện thao tác này!')
            return res.redirect('back');
        }

        // Kiểm tra sản phẩm có tồn tại và đang hoạt động hay không
        const product = await Product.findOne({ _id: productId, status: "active", deleted: false });
        if (!product) {
            req.flash('danger', 'Sản phẩm này không tồn tại!');
            return res.redirect('back');
        }

        // Kiểm tra số lượng có hợp lệ không
        if (stock > product.stock) {
            req.flash('danger', 'Số lượng sản phẩm không hợp lệ!');
            return res.redirect('back');
        }
        // Tìm giỏ hàng của user
        let cart = await Cart.findOne({userId : user._id });
        if (!cart) {
            // Nếu không có giỏ hàng, tạo giỏ hàng mới
            const newCart = new Cart({
                userId: user._id,
                products: [{ productId: productId , stock: stock }]
            });
            await newCart.save();
        } else {
            // Tìm sản phẩm trong giỏ hàng
            let productInCart = cart.products.find(obj => obj.productId === productId);
            if (productInCart) {
                // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
                productInCart.stock = stock;
            } else {
                // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm mới
                cart.products.push({ productId: product._id, stock: stock });
            }
            // Lưu lại giỏ hàng
            await cart.save();
        }
        req.flash('success', 'Sản phẩm đã được thêm vào giỏ hàng!');
        return res.redirect('back');
    }catch(error){
        console.log(error);
        req.flash('danger','Lỗi thêm vào giỏ hàng!');
        res.redirect('back');
    }
};

module.exports.deleteProduct = async (req, res) => {
    const { productId } = req.body;
    
    // Tìm user dựa vào token từ cookies
    const user = await ClientAccount.findOne({ token: req.cookies.token });

    if (!user) {
        return res.redirect('back');
    }

    // Tìm giỏ hàng của user
    let cart = await Cart.findOne({ userId: user._id });

    if (!cart) {
        req.flash('danger', 'Giỏ hàng không tồn tại!');
        return res.redirect('back');
    }

    // Lọc ra sản phẩm muốn xóa
    cart.products = cart.products.filter(item => item.productId !== productId);

    // Lưu lại giỏ hàng sau khi xóa
    await cart.save();

    req.flash('success', 'Sản phẩm đã được xóa khỏi giỏ hàng!');
    return res.redirect('back');
};
