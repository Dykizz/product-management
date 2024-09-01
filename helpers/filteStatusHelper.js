module.exports = (query)=>{
    let filterStatus = [
        {
            name : "Tất cả",
            status : "",
            class : ""
        },
        {
            name : "Hoạt động",
            status : "active",
            class : ""
        },
        {
            name : "Dừng hoạt động",
            status : "inactive",
            class : ""
        }
    ];
    // Đánh dấu trạng thái nào được bật
    if (query.status){
        const index = filterStatus.findIndex(item => item.status == query.status);
        filterStatus[index].class = "active";
    }else {
        filterStatus[0].class = "active";
    }
    return filterStatus;
}