// Delete Item
const formDeleteItem = document.querySelector("#formDeleteItem");
const buttonDeletes = document.querySelectorAll("[button-delete-item]");
if (buttonDeletes.length > 0){
    buttonDeletes.forEach(button => {
        button.addEventListener("click", ()=>{
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa nhóm quyền này ?");
            if (!isConfirm) return;
            const id = button.getAttribute("data-id");
            const path = formDeleteItem.getAttribute("data-path");
            const action = `${path}/${id}?_method=DELETE`;
            formDeleteItem.action = action;
            formDeleteItem.submit();
        })
    })
}

// End Delete Item