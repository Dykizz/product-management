const Product = require('../../models/product.model')
const filterStatusHelper = require('../../helpers/filteStatusHelper');
const searchHelper = require('../../helpers/searchHelper');
const paginationHelper = require('../../helpers/paginationHelper')
const configSystem = require('../../config/system')
// [GET] /admin/products
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }
    const filterStatus = filterStatusHelper(req.query);
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    if (objectSearch.status) {
        find.status = objectSearch.status;
    }

    const objectPagination = await paginationHelper(Product, find, req.query);
    const products = await Product.find(find)
        .sort({position : "desc"})
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skipItems);

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        totalPage: objectPagination.totalPage,
        currentPage: objectPagination.currentPage
    })
}

// [PACTH] /admin/products/changeStatus/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    const currentStatus = status == "active" ? "inactive" : "active";
    await Product.updateOne({ _id: id }, { status: currentStatus });
    req.flash('success', 'Cập nhật trạng thái sản phẩm thành công!');
    res.redirect("back");
}
// [PATCH] /admin/prodcuts/change-multi
module.exports.changeMulti = async (req, res) => {
    const info = req.body;
    const type = info.type;
    const ids = info.ids.split(", ");
    switch (type) {
        case "active":
            await Product.updateMany(
                { _id: { $in: ids } },
                { $set: { status: "active" } }
            );
            req.flash('success', `Cập nhật trạng thái ${ids.length} sản phẩm thành công!`);
            break;
        case "inactive":
            await Product.updateMany(
                { _id: { $in: ids } },
                { $set: { status: "inactive" } }
            )
            req.flash('success', `Cập nhật trạng thái ${ids.length} sản phẩm thành công!`);
            break;
        case "delete-all":
            const deleteAt = new Date();
            await Product.updateMany(
                { _id: { $in: ids } },
                { $set: { deleteAt: deleteAt.toLocaleString() } }
            );
            req.flash('success', `Xóa ${ids.length} sản phẩm thành công!`);
            break;
        case "change-position":
            for (const item of ids) {
                const [id, position] = item.split("-");
                await Product.updateOne({ _id: id }, { position: parseInt(position) });
                req.flash('success', `Thay đổi vị trí ${ids.length} sản phẩm thành công!`);
            }
            break;
        default:
            break;

    }
    res.redirect("back")
}
// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    const time = new Date();
    await Product.updateOne({ _id: id }, { deleted: true, deleteAt: time.toLocaleString() });
    req.flash('success', `Xóa sản phẩm thành công!`);
    res.redirect("back");

}
// [GET] /admin/products/create
module.exports.create = (req,res) =>{
    res.render("admin/pages/products/create-product",{
        pageTitle : "Tạo sản phẩm"
    });
}
// [POST] /admin/products/create
module.exports.createPost =async (req,res) =>{
    const body = req.body;
    req.body.price = parseInt(req.body.price);
    req.body.stock = parseInt(req.body.stock);
    req.body.discountPercentage = parseFloat(req.body.discountPercentage);
    if (req.body.position == ""){
        const cnt = await Product.countDocuments({});
        req.body.position = cnt + 1;
    }else {
        req.body.position = parseInt(req.body.position);
    }
    const prodcut = new Product(req.body);
    prodcut.save();
    req.flash('success', `Tạo mới sản phẩm thành công!`);
    res.redirect(`${configSystem.prefixAdmin}/products`);
}