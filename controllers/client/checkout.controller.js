const Order = require('../../models/order.model');
const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');

// [GET] /checkout
module.exports.index = async (req, res) => {
    const { cart } = res.locals;
    if (!cart) return res.redirect('back');
    const products = cart.products.filter(ob => ob.chose);
    if (products.length == 0) return res.redirect('back');
    for (ob of products) {
        if (!ob.chose) continue;
        ob.product = await Product.findOne({ _id: ob.productId });
        ob.priceNew = ob.product.price * (1 - ob.product.discountPercentage / 100);
        ob.total = ob.priceNew*ob.quantity;
    }
    const totalPrice = products.reduce((sum,item) => sum + item.total , 0);
    res.render('client/pages/checkout/index.pug', {
        pageTitle: "Đặt hàng",
        products: products,
        totalPrice: totalPrice
    })
}
// [POST] /checkout/order
module.exports.order = async (req, res) => {
    try {
        const { fullName, phone, address } = req.body;
        const { cart } = res.locals;

        if (!cart) {
            req.flash('danger', 'Chưa có sản phẩm nào trong giỏ hàng!');
            return res.redirect('back');
        }

        const phonePattern = /^\+?(\d[\d-. ]+)?(\([\d-. ]+\))?[\d-. ]+\d$/;
        if (!fullName || !phone || !address) {
            req.flash('danger', 'Vui lòng điền đầy đủ thông tin!');
            return res.redirect('back');
        }

        if (!phonePattern.test(phone)) {
            req.flash('danger', 'Số điện thoại này không hợp lệ!');
            return res.redirect('back');
        }

        let products = [];

        for (product of cart.products) {
            if (!product.chose) continue;
            const id = product.productId;
            const product_item = await Product.findOne({ _id: id, status: "active" });

            if (!product_item) {
                req.flash('danger', `Sản phẩm với ID ${id} không tồn tại!`);
                return res.redirect('back');
            }

            products.push(
                {
                    productId: id,
                    quantity: product.quantity,
                    price: product_item.price,
                    discountPercentage: product_item.discountPercentage
                }
            )

            product_item.stock -= product.quantity;
            await product_item.save();

        }

        cart.products = cart.products.filter(ob => !ob.chose);

        await cart.save();

        let inforOrder = {
            user_id: cart.userId,
            cart_id: cart._id,
            infor: {
                fullName: fullName,
                phone: phone,
                address: address
            },
            products: products
        };

        const order = new Order(inforOrder);
        await order.save();

        return res.redirect(`/checkout/success/${order._id}`);
    } catch (error) {
        console.log(error);
        req.flash('danger', 'Đã xảy ra lỗi khi đặt hàng!');
        return res.redirect('back');
    }

}
// [GET] checkout/success
module.exports.success = async (req,res) =>{
    const { OrderID } = req.params;

    const order = await Order.findOne({_id : OrderID});

    if (!order) return res.redirect('back');

    for (const product of order.products){
        const productInfor = await Product.findOne({_id : product.productId },"title thumbnail");
        product.title = productInfor.title;
        product.thumbnail = productInfor.thumbnail;
        product.priceNew = product.price*(1 - product.discountPercentage/100);
        product.total = product.priceNew*product.quantity;
    }
    order.totalPrice = order.products.reduce((sum,item) => sum + item.total,0);

    res.render('client/pages/checkout/success.pug',{
        pageTitle : 'Đặt hàng thành công',
        order : order
    })
}


// [GET] /checkout/list-ordered
module.exports.listOrdered = async (req, res) => {
    const { account } = res.locals;
    if (!account) {
        return res.redirect('back');
    }
    let list = await Order.find({ user_id: account._id });
    for (infor of list) {
        for (item of infor.products) {
            item.product = await Product.findOne({ _id: item.productId });
            item.priceNew = item.price * (1 - item.discountPercentage/100);
        }
    }
    res.render('client/pages/checkout/ordered.pug', {
        pageTitle: 'Lịch sử các đơn hàng',
        list: list
    });
}
