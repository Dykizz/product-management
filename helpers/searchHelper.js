module.exports = (query) => {
    //Trả về keyword , regex của keyword , status
    let objectSearch = {
        keyword : ""
    }
    if (query.keyword){
        objectSearch.keyword = query.keyword;
        const regex = new RegExp(query.keyword, 'i');
        objectSearch.regex = regex;
    }
    if (query.status) objectSearch.status = query.status;
    return objectSearch;
}