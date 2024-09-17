const { default: mongoose } = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const productCategorySchema = new mongoose.Schema(
    {
        title: String,
        parent_id : {
            type : String,
            default : ""
        },
        description: String,
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
const Categories = mongoose.model("Categories",productCategorySchema,"categories");

module.exports = Categories;