const Categories = require('../../models/categories.model.js');
const createTree = require('../../helpers/createTree.js');
module.exports.index = async (req,res,next) =>{
    const categories = await Categories.find({deleted : false});
    const categoryTree = createTree(categories);
    res.locals.categoryTree = categoryTree;
    next();
}