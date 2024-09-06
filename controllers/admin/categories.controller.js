const Categories = require('../../models/categories.model');
const filterStatusHelper = require('../../helpers/filteStatusHelper');
const searchHelper = require('../../helpers/searchHelper');
const paginationHelper = require('../../helpers/paginationHelper');
const configSystem = require('../../config/system');
// [GET] /admin/categories
module.exports.index = async (req,res) => {
    let find = {
        deleted: false
    }
    let sort = {};
    if (req.query.keySort){
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
    const objectPagination = await paginationHelper(Categories, find, req.query);
    const categories = await Categories.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skipItems);
    res.render('admin/pages/categories/index.pug',{
        pageTitle : "Danh mục sản phẩm",
        categories : categories,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        totalPage: objectPagination.totalPage,
        currentPage: objectPagination.currentPage
    })
}

// [PACTH] /admin/categories/changeStatus/:status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const status = req.params.status;
        const id = req.params.id;
        const currentStatus = status == "active" ? "inactive" : "active";
        await Categories.updateOne({ _id: id }, { status: currentStatus });
        req.flash('success', 'Cập nhật trạng thái sản phẩm thành công!');
        res.redirect("back");
    } catch (error) {
        res.redirect("back");
    }
    
}

// [PATCH] /admin/categories/change-multi
module.exports.changeMulti = async (req, res) => {
    const info = req.body;
    const type = info.type;
    const ids = info.ids.split(", ");
    switch (type) {
        case "active":
            await Categories.updateMany(
                { _id: { $in: ids } },
                { $set: { status: "active" } }
            );
            req.flash('success', `Cập nhật trạng thái ${ids.length} danh mục thành công!`);
            break;
        case "inactive":
            await Categories.updateMany(
                { _id: { $in: ids } },
                { $set: { status: "inactive" } }
            )
            req.flash('success', `Cập nhật trạng thái ${ids.length} danh mục thành công!`);
            break;
        case "delete-all":
            const deleteAt = new Date();
            await Categories.updateMany(
                { _id: { $in: ids } },
                { $set: { deleteAt: deleteAt.toLocaleString() } }
            );
            req.flash('success', `Xóa ${ids.length} danh mục thành công!`);
            break;
        case "change-position":
            for (const item of ids) {
                const [id, position] = item.split("-");
                await Categories.updateOne({ _id: id }, { position: parseInt(position) });
                req.flash('success', `Thay đổi vị trí ${ids.length} danh mục thành công!`);
            }
            break;
        default:
            break;

    }
    res.redirect("back")
}

const createTree = require('../../helpers/createTree');
// [GET] /admin/categories/create
module.exports.create = async (req,res) =>{
    const categories = await Categories.find({deleted : false});
    let tree = createTree(categories); // Tạo cho mục select
    res.render('admin/pages/categories/create-category.pug',{
        pageTitle : "Tạo danh mục",
        categoriesTree : tree,
    });
}

// [POST] /admin/categories/create  
module.exports.createPost = async (req,res) =>{
    try {
        if (req.body.position){
            req.body.position = parseInt(req.body.position);
        }else{
            let positionCurrent = await Categories.countDocuments({deleted : false});
            req.body.position = positionCurrent + 1;
        }
        const category = new Categories(req.body);
        category.save();
        res.flash('success','Tạo mới danh mục thành công!');
        res.redirect(`${configSystem.prefixAdmin}/categories`);
    } catch (error) {
        res.flash('danger','Lỗi trong việc tạo danh mục. Vui lòng kiểm tra lại!');
        res.redirect('back');
    }
}

// [DELETE] admin/delete/:id
module.exports.delete = async (req,res) =>{
    const id = req.params.id;
    const time = new Date();
    await Categories.updateOne({ _id: id }, { deleted: true, deleteAt: time });
    req.flash('success', `Xóa danh mục thành công!`);
    res.redirect('back');
}

// [GET] admin/detail/:id
module.exports.detail = async (req,res) =>{
    const id = req.params.id ;
    const category = await Categories.findOne({deleted : false, _id : id});
    if (category.updatedAt) category.timeUpdate = category.updatedAt.toLocaleString();
    if (category.createdAt) category.timeCreate = category.createdAt.toLocaleString();
    res.render('admin/pages/categories/detail-category.pug',{
        pageTitle : "Chi tiết danh mục",
        category : category
    });
}

// [GET] admin/edit/:id
module.exports.edit = async (req,res) =>{
    const id = req.params.id ;
    const category = await Categories.findOne({deleted : false, _id : id});
    if (category.updatedAt) category.timeUpdate = category.updatedAt.toLocaleString();
    if (category.createdAt) category.timeCreate = category.createdAt.toLocaleString();
    res.render('admin/pages/categories/edit-category.pug',{
        pageTitle : "Chỉnh sửa danh mục",
        category : category
    });

}

// [PATCH] admin/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    if (req.body.position) req.body.position = parseInt(req.body.position);
    try {
        await Categories.updateOne({ _id: id }, req.body);

        // Nếu cập nhật thành công, hiển thị thông báo và chuyển hướng
        req.flash('success', 'Cập nhật danh mục thành công!');
        res.redirect(`${configSystem.prefixAdmin}/categories`);
    } catch (error) {
        console.error('Lỗi khi cập nhật sản phẩm:', error);
        // Nếu có lỗi, hiển thị thông báo lỗi và chuyển hướng
        req.flash('danger', 'Có lỗi xảy ra khi cập nhật danh mục!');
        res.redirect(`${configSystem.prefixAdmin}/categories/edit/${id}`);
    }

}