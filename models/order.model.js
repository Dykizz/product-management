const { default: mongoose } = require("mongoose");

const OrderSchema = new mongoose.Schema(
    {
        user_id : String,
        cart_id : String,
        infor : {
            fullName : String,
            phone : String,
            address : String
        },
        products : [
            {
                productId : String,
                quantity : Number,
                price : Number,
                discountPercentage : Number
            }
        ]
    }, { timestamps: true }
)

const Order = mongoose.model("Order",OrderSchema,"order");

module.exports = Order;