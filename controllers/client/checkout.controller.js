const Order = require('../../models/order.model');
const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');

module.exports.index = async (req, res) => {
    const { cart } = res.locals;

    const products = cart.products.filter(ob => ob.chose);

    let totalPrice = 0;
    for (ob of products) {
        if (!ob.chose) continue;
        ob.product = await Product.findOne({ _id: ob.productId });
        ob.product.priceNew = (ob.product.price * (1 - ob.product.discountPercentage / 100)).toFixed(2);
        totalPrice += parseFloat(ob.product.priceNew) * ob.quantity;
    }

    res.render('client/pages/checkout/index.pug', {
        pageTitle: "Đặt hàng",
        products: products,
        totalPrice: totalPrice
    })
}

module.exports.order = async (req, res) => {
    try {
        const { fullName, phone, address } = req.body;
        const { cart } = res.locals;
        if (!cart) {
            req.flash('danger', 'Chưa có sản phẩm nào trong giỏ hàng!');
            return res.redirect('back');
        }
        const phonePattern = /^\+?(\d[\d-. ]+)?(\([\d-. ]+\))?[\d-. ]+\d$/;
        if (!fullName || !phone || !address) return res.redirect('back');
        if (!phonePattern.test(phone)) {
            req.flash('danger', 'Số điện thoại này không hợp lệ!');
            return res.redirect('back');
        }
        let products = cart.products.filter(ob => ob.chose);
        cart.products = cart.products.filter(ob => !ob.chose);
        await cart.save();

        for (ob of products) {
            let product = await Product.findOne({ _id: ob.productId });
            ob.price = product.price;
            ob.discountPercentage = product.discountPercentage;
            product.stock -= ob.quantity;
            await product.save();
        }

        let inforOrder = {
            user_id: cart.userId,
            cart_id: cart._id,
            infor: {
                fullName: fullName,
                phone: phone,
                address: address
            },
            products: products
        }
        const order = new Order(inforOrder);
        await order.save();
        req.flash('success', 'Đặt hàng thành công!');
        return res.redirect('/cart');
    } catch (error) {
        console.log(error);
        return res.redirect('back');
    }


}
