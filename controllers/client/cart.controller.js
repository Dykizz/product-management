const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');

module.exports.index = async (req, res) => {
    const { cart } = res.locals;
    if (!cart) {
        req.flash('warning', 'Hãy đăng nhập để mở giỏ hàng!');
        return res.redirect('back');
    }
    let choseAll = true;
    for (let ob of cart.products) {
        ob.product = await Product.findOne({ _id: ob.productId });
        if (choseAll && !ob.chose) choseAll = false;
        ob.product.priceNew = (ob.product.price * (1 - ob.product.discountPercentage / 100)).toFixed(2);
    }
    
    res.render('client/pages/cart/index.pug', {
        pageTitle: "Giỏ hàng",
        cart: cart,
        choseAll : choseAll
    })
}

module.exports.addProduct = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const { account, cart } = res.locals;
        if (!account) {
            req.flash('warning', 'Hãy đăng nhập để thực hiện thao tác này!')
            return res.redirect('back');
        }

        // Kiểm tra sản phẩm có tồn tại và đang hoạt động hay không
        const product = await Product.findOne({ _id: productId, status: "active", deleted: false });
        if (!product) {
            req.flash('danger', 'Sản phẩm này không tồn tại!');
            return res.redirect('back');
        }
 
        // Kiểm tra số lượng có hợp lệ không
        if (quantity > product.stock) {
            req.flash('danger', 'Số lượng sản phẩm không hợp lệ!');
            return res.redirect('back');
        }

        if (!cart) {
            // Nếu không có giỏ hàng, tạo giỏ hàng mới
            const newCart = new Cart({
                userId: account._id,
                products: [{ productId: productId, quantity: quantity }]
            });
            await newCart.save();
        } else {
            // Tìm sản phẩm trong giỏ hàng
            let productInCart = cart.products.find(obj => obj.productId === productId);
            if (productInCart) {
                // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
                productInCart.quantity = quantity;
            } else {
                // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm mới
                cart.products.push({ productId: product._id, quantity: quantity });
            }
            // Lưu lại giỏ hàng
            await cart.save();
        }
        req.flash('success', 'Sản phẩm đã được thêm vào giỏ hàng!');
        return res.redirect('back');
    } catch (error) {
        console.log(error);
        req.flash('danger', 'Lỗi thêm vào giỏ hàng!');
        res.redirect('back');
    }
};

module.exports.deleteProduct = async (req, res) => {
    const { productId } = req.body;
    const { account, cart } = res.locals;
    console.log(productId);
    if (!account) {
        return res.redirect('/cart');
    }

    if (!cart) {
        req.flash('danger', 'Giỏ hàng không tồn tại!');
        return res.redirect('/cart');
    }

    // Lọc ra sản phẩm muốn xóa
    cart.products = cart.products.filter(item => item.productId !== productId);

    // Lưu lại giỏ hàng sau khi xóa
    await cart.save();

    req.flash('success', 'Sản phẩm đã được xóa khỏi giỏ hàng!');
    return res.redirect('/cart');
};


module.exports.save = async (req, res) => {
    let { data } = req.body;
    const { account, cart } = res.locals;
    if (!account) {
        return res.redirect('/cart');
    }

    if (!cart) {
        req.flash('danger', 'Giỏ hàng không tồn tại!');
        return res.redirect('/cart');
    }

    data = data.split(';');
    let ProductIdDelete = [];

    data.forEach(item => {
        item = item.split('-');
        if (item[0] == 'delete') { // định dạng : delete-productId
            ProductIdDelete.push(item[1]);
        } else { // Định dạng : chose-productId-quantity
            for (let i = 0; i < cart.products.length; i++) {
                if (cart.products[i].productId == item[1]) {
                    cart.products[i].chose = item[0] == '1'; 
                    cart.products[i].quantity = parseInt(item[2], 10);
                    break;
                }
            }
        }
    });

    cart.products = cart.products.filter(item => !ProductIdDelete.includes(item.productId));
    
    await cart.save();
    
    res.flash('success', 'Cập nhật giỏ hàng thành công!');
    res.redirect('back');
}