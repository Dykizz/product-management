

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