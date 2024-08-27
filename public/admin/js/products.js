const formChangeStatus = document.querySelector("#formChangeStatus");
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