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
