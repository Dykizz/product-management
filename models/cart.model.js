const { default: mongoose } = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        userId : String,
        products : [
            {
                productId : String,
                quantity : Number,
                chose : Boolean
            }
        ]
    }, { timestamps: true }
)
const Cart = mongoose.model("Cart",cartSchema,"cart");

module.exports = Cart;