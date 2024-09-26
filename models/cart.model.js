const { default: mongoose } = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        userId : String,
        products : [
            {
                productId : String,
                quantity : Number,
                chose : {
                    type : Boolean,
                    default : true
                }
            }
        ]
    }, { timestamps: true }
)
const Cart = mongoose.model("Cart",cartSchema,"cart");

module.exports = Cart;