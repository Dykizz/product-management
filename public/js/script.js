

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

// Go Back
const btnGoBack = document.querySelectorAll("[btn-go-back]");
if (btnGoBack){
    btnGoBack.forEach(btn => {
        btn.addEventListener('click',() => {
            let step = btn.getAttribute('step') || 1;
            for (let i = 0; i < step ; i++){
                history.back();
            }
        })
    })
}
// End Go Back
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