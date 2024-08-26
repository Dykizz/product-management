module.exports = async (Model,find,query,limitItems = 5) => {
    let objectPagination = {
        currentPage : 1,
        limitItems : limitItems,
        skipItems : 0,
        totalPage : 1
    }
    const totalItems = await Model.countDocuments(find);
    const totalPage = Math.ceil(totalItems/objectPagination.limitItems);
    objectPagination.totalPage = totalPage;
    if (query.page && query.page <= totalPage ) objectPagination.currentPage = parseInt(query.page);
    objectPagination.skipItems = (objectPagination.currentPage - 1)*objectPagination.limitItems ;
    return objectPagination;
}