const { default: mongoose } = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const productSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        price: Number,
        category_id : String,
        discountPercentage: Number,
        stock: Number,
        slug: { type: String, slug: "title", unique: true },
        thumbnail: String,
        status: String,
        position: Number,
        createBy : {
            account_id : String,
            createAt : Date
        },
        deleted: {
            type : Boolean,
            default : false
        },
        deleteBy : {
            account_id : String,
            deleteAt : Date
        },
        updateBy : [
            {
                account_id : String,
                updateAt : Date
            }
        ]

    }
)
const Product = mongoose.model("Product",productSchema,"products");

module.exports = Product;