// Change Status
const formChangeStatus = document.querySelector("[formChangeStatus]");
const path = formChangeStatus.getAttribute("data-path");

const buttonsChangeStatus = document.querySelectorAll("[buttonChangeStatus]");
if (buttonsChangeStatus.length > 0){
    buttonsChangeStatus.forEach(button =>{
        const status = button.getAttribute("status");
        const id = button.getAttribute("id");
        button.addEventListener("click",() => {
            
            const action = path + `/${status}/${id}?_method=PATCH`;
            formChangeStatus.action = action;
            formChangeStatus.submit();
        })
    })
}
// End Change Status

// Delete Item
const formDeleteItem = document.querySelector("#formDeleteItem");
const buttonDeletes = document.querySelectorAll("[button-delete-item]");
if (buttonDeletes.length > 0){
    buttonDeletes.forEach(button => {
        button.addEventListener("click", ()=>{
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa sản phẩm này ?");
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

