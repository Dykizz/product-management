

// Delete Item
const formDeleteItem = document.querySelector("#formDeleteItem");
const buttonDeletes = document.querySelectorAll("[button-delete-item]");
if (buttonDeletes.length > 0) {
    buttonDeletes.forEach(button => {
        button.addEventListener("click", () => {
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

// Default Data
const record = document.querySelector("[record]");
if (record){
    const roles = JSON.parse(record.getAttribute("record"));
    const tablePermisson = document.querySelector("[table-permission]");
    
    roles.forEach((role,index) =>{
        const permissions = role.permissions || [];
        // Duyệt qua các quyền
        permissions.forEach(item =>{
            const row = tablePermisson.querySelector(`[data-name="${item}"]`);
            if (row){
                const inputs = row.querySelectorAll("input");
                inputs[index].checked = true; 
            }
        })
    })
}

// End default data


// End Delete Item

// Submit Permission
const tablePermisson = document.querySelector("[table-permission]");
if (tablePermisson) {
    const buttonSubmit = document.querySelector("[submit-form]"); 
    buttonSubmit?.addEventListener('click', () => {
        let groupPermission = [];
        const rows = tablePermisson.querySelectorAll("[data-name]");
        rows.forEach(row => {
            const name = row.getAttribute("data-name");
            if (name == "id") {
                const inputs = row.querySelectorAll("input");
                inputs.forEach(input => {
                    groupPermission.push({ id: input.value , permissions : []})
                })
            } else {
                const inputs = row.querySelectorAll("input");
                inputs.forEach((input, index) => {
                    if (input.checked) {
                        groupPermission[index].permissions.push(name);
                    }
                })
            }
        });
        if (groupPermission.length > 0){
            const form = document.querySelector("#formPermissions");
            const input = form.querySelector("input[name='groupPermission']");
            input.value = JSON.stringify(groupPermission);
            form.submit();
        }
    })
}
// End Submit Premission