// Button Status
const buttonStatus = document.querySelectorAll("[button-status]");

if (buttonStatus.length > 0) {
    let url = new URL(window.location.href)
    buttonStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            if (status) {
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }
            window.location.href = url.href;
        })
    })
}
// End Button Status
// Form Search
const formSearch = document.querySelector("#formSearch");
if (formSearch) {
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = (e.target.elements.keyword.value);
        if (keyword) {
            url.searchParams.set("keyword", keyword);
        } else url.searchParams.delete("keyword");
        window.location.href = url.href;
    })
}

//End Form Search
//Pagination
const buttonPages = document.querySelectorAll("[direction-page]");
if (buttonPages.length > 0) {
    let url = new URL(window.location.href);
    buttonPages.forEach(button => {
        button.addEventListener("click", () => {
            const directionPage = parseInt(button.getAttribute("direction-page"));
            url.searchParams.set("page", directionPage);
            window.location.href = url;
        })
    })
}
// End Pagination
// Check Box
const tableCheckBox = document.querySelector("[table-check-box]");
if (tableCheckBox) {
    const checkAll = tableCheckBox.querySelector("input[name='checkall']");
    const checkBoxs = tableCheckBox.querySelectorAll("input[name='id']");
    checkAll.addEventListener("click", () => {
        checkBoxs?.forEach(checkbox => checkbox.checked = checkAll.checked);
    })
    checkBoxs?.forEach(checkbox => {
        checkbox.addEventListener("click", () => {
            if (checkbox.checked) {
                const countCheck = tableCheckBox.querySelectorAll("input[name='id']:checked").length;
                if (countCheck == checkBoxs.length) checkAll.checked = true;
            } else {
                checkAll.checked = false;
            }
        })
    })
}
//End Check Box
//Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();

        const boxCheckeds = tableCheckBox.querySelectorAll("input[name='id']:checked");
        if (boxCheckeds.length == 0) {
            alert("Bạn vui lòng chọn ít nhất 1 sản phẩm để thực hiện!");
            return;
        }

        const typeChange = e.target.elements.type.value;
        if (typeChange == "") {
            alert("Vui lòng chọn hoạt động!");
            return;
        }
        if (typeChange == "delete-all") {
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa những sản phẩm này?");
            if (!isConfirm) return;
        }

        let ids = [];
        if (typeChange == "change-position") {
            boxCheckeds.forEach(item => {
                const position = item.closest("tr").querySelector("input[name='position']").value;
                ids.push(`${item.value}-${position}`);
            })
        } else {
            boxCheckeds.forEach(item => {
                ids.push(item.value)
            });
        }

        const inputIds = document.querySelector("input[name='ids']");
        inputIds.value = ids.join(", ");
        formChangeMulti.submit();
    })
}

//End Form Change Multi

// Notification 
const NotificationAlert = document.querySelector("[show-alert]");
if (NotificationAlert) {
    const buttonClose = NotificationAlert.querySelector(".button-close");
    const timeShow = NotificationAlert.getAttribute("time-show");
    buttonClose.addEventListener("click", () => {
        NotificationAlert.classList.add("alert-hidden");
    })

    NotificationAlert.classList.add("show");

    setTimeout(() => {
        NotificationAlert.classList.add("alert-hidden");
    }, timeShow);
}

// End Notification

// Upload Image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
    const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
    const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");
    const innerImage = uploadImage.querySelector(".inner-image-preview");
    const buttonClose = uploadImage.querySelector(".button-close");

    uploadImageInput.addEventListener("change", () => {
        const [file] = uploadImageInput.files;
        if (file) {
            uploadImagePreview.src = URL.createObjectURL(file);
            innerImage.classList.remove("hidden");
        }
    });

    buttonClose.addEventListener("click", () => {
        uploadImageInput.value = "";
        uploadImagePreview.src = ""
        innerImage.classList.add("hidden");
    })
}

// End Upload Image