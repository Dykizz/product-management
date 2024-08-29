const { default: mongoose } = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const productSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        price: Number,
        discountPercentage: Number,
        stock: Number,
        slug: { type: String, slug: "title", unique: true },
        thumbnail: String,
        status: String,
        position: Number,
        deleted: {
            type : Boolean,
            default : false
        },
        deleteAt : String
    }, { timestamps: true }
)
const Product = mongoose.model("Product",productSchema,"products");

module.exports = Product;