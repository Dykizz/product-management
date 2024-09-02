let createTree = (arr = [], parent_id = "",level = 0) => {
    let tree = [];
    arr.forEach(item => {
        if (item.parent_id == parent_id){
            item.level = level;
            item.children = createTree(arr,item._id,level + 1);
            tree.push(item);
        }
    });
    return tree;
}

module.exports = createTree; 