const Product = require('../../models/product.model');
const Account = require('../../models/account.model');
const Categories = require('../../models/categories.model');
const filterStatusHelper = require('../../helpers/filteStatusHelper');
const searchHelper = require('../../helpers/searchHelper');
const paginationHelper = require('../../helpers/paginationHelper')
const configSystem = require('../../config/system');

// [GET] /admin/products
module.exports.index = async (req, res) => {
    let find = {
        deleted: false 
    }
    let sort = {};
    if (req.query.keySort) {
        sort[req.query.keySort] = req.query.valueSort == 'asc' ? 1 : -1;
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
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skipItems);

    for (product of products) {
        if (product.createBy) {
            const id = product.createBy.account_id;
            const user = await Account.findOne({ _id: id }, "fullName");
            if (user) {
                product.createByUser = user.fullName;
            }
        }
    }
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
    try {
        const status = req.params.status;
        const id = req.params.id;
        const currentStatus = status == "active" ? "inactive" : "active";
        const updateBy = {
            account_id: res.locals.user._id,
            updateAt: Date.now()
        }
        await Product.updateOne({ _id: id }, { status: currentStatus, $push: { updateBy: updateBy } });
        req.flash('success', 'Cập nhật trạng thái sản phẩm thành công!');
        res.redirect("back");
    } catch (error) {
        res.redirect("back");
    }

}
// [PATCH] /admin/prodcuts/change-multi
module.exports.changeMulti = async (req, res) => {
    const info = req.body;
    const type = info.type;
    const ids = info.ids.split(", ");
    const updateBy = {
        account_id: res.locals.user._id,
        updateAt: Date.now()
    }
    switch (type) {
        case "active":
            await Product.updateMany(
                { _id: { $in: ids } },
                { $set: { status: "active" }, $push: { updateBy: updateBy } }
            );
            req.flash('success', `Cập nhật trạng thái ${ids.length} sản phẩm thành công!`);
            break;
        case "inactive":
            await Product.updateMany(
                { _id: { $in: ids } },
                { $set: { status: "inactive" }, $push: { updateBy: updateBy } }
            )
            req.flash('success', `Cập nhật trạng thái ${ids.length} sản phẩm thành công!`);
            break;
        case "delete-all":
            const deleteBy = { account_id: res.locals.user._id, deleteAt: Date.now() }
            await Product.updateMany(
                { _id: { $in: ids } },
                { $set: { deleted: true, deleteBy: deleteBy } }
            );
            req.flash('success', `Xóa ${ids.length} sản phẩm thành công!`);
            break;
        case "change-position":
            for (const item of ids) {
                const [id, position] = item.split("-");
                await Product.updateOne({ _id: id }, { position: parseInt(position), $push: { updateBy: updateBy } });
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
    const deleteBy = { account_id: res.locals.user._id, deleteAt: Date.now() }
    await Product.updateOne({ _id: id }, { deleted: true, deleteBy: deleteBy });
    req.flash('success', `Xóa sản phẩm thành công!`);
    res.redirect("back");

}
const createTree = require('../../helpers/createTree');
// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    const categories = await Categories.find({ deleted: false });
    let tree = createTree(categories);
    res.render("admin/pages/products/create-product", {
        pageTitle: "Tạo sản phẩm",
        categoriesTree: tree
    });
}
// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    try {
        req.body.price = parseInt(req.body.price);
        req.body.stock = parseInt(req.body.stock);
        req.body.discountPercentage = parseFloat(req.body.discountPercentage);
        if (req.body.position == "") {
            const cnt = await Product.countDocuments({});
            req.body.position = cnt + 1;
        } else {
            req.body.position = parseInt(req.body.position);
        }
        req.body.featured = req.body.featured == "true";
        req.body.createBy = { account_id: res.locals.user._id, createAt: Date.now() };
        const prodcut = new Product(req.body);
        prodcut.save();
        req.flash('success', `Tạo mới sản phẩm thành công!`);
        res.redirect(`${configSystem.prefixAdmin}/products`);

    } catch (error) {
        console.log(error);
        req.flash('danger', `Lỗi tạo sản phẩm!`);
        res.redirect("back");
    }

}
// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    const product = await Product.findOne({ _id: id });
    const categories = await Categories.find({ deleted: false });
    let tree = createTree(categories);
    res.render("admin/pages/products/edit-product.pug", {
        pageTitle: "Chỉnh sửa sản phẩm",
        product: product,
        categoriesTree: tree
    });
}
// [GET] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    let updateData = {};
    req.body.featured = req.body.featured == "true";
    // Danh sách các trường cần kiểm tra
    const fieldsToUpdate = ['title', 'description', 'price', 'stock', 'status', 'discountPercentage', 'position', 'thumbnail'];

    // Lặp qua từng trường và gán giá trị tương ứng nếu tồn tại trong req.body
    fieldsToUpdate.forEach(field => {
        if (req.body[field]) {
            updateData[field] = field === 'price' || field === 'stock' || field === 'position'
                ? parseInt(req.body[field])
                : field === 'discountPercentage'
                    ? parseFloat(req.body[field])
                    : req.body[field];
        }
    });


    try {
        const updateBy = {
            account_id: res.locals.user._id,
            updateAt: Date.now()
        }
        await Product.updateOne({ _id: id },
            {
                ...updateData,
                $push: { updateBy: updateBy }
            });

        // Nếu cập nhật thành công, hiển thị thông báo và chuyển hướng
        req.flash('success', 'Cập nhật sản phẩm thành công!');
        res.redirect(`${configSystem.prefixAdmin}/products`);
    } catch (error) {
        console.error('Lỗi khi cập nhật sản phẩm:', error);
        // Nếu có lỗi, hiển thị thông báo lỗi và chuyển hướng
        req.flash('danger', 'Có lỗi xảy ra khi cập nhật sản phẩm!');
        res.redirect(`${configSystem.prefixAdmin}/products/edit/${id}`);
    }

}
// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        let product = await Product.findOne({ _id: id });
        const idUserCreate = product.createBy.account_id;
        const userCreate = await Account.findOne({ _id: idUserCreate }, "fullName");
        product.createByUser = userCreate?.fullName;
        
        if (product.updateBy.at(-1)){
            const idUserUpdate = product.updateBy.at(-1).account_id;
            const userUpdate = await Account.findOne({ _id: idUserUpdate }, "fullName");
            product.updateByUser = userUpdate?.fullName;
            
        }
        res.render('admin/pages/products/detail-product.pug', {
            pageTitle: 'Thông tin chi tiết',
            product: product
        })
    } catch (error) {
        console.log(error);
        req.flash('danger','Lỗi truy cập!')
        res.redirect('back')
    }

}