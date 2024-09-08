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
        createBy : {
            account_id : String,
            createAt : {
                type : Date,
                default : Date.now
            }
        },
        deleted: {
            type : Boolean,
            default : false
        },
        deleteBy : {
            account_id : String,
            deleteAt : Date
        }
    }
)
const Product = mongoose.model("Product",productSchema,"products");

module.exports = Product;