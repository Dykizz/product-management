
const addressIframe = document.getElementById("address");
const showIframe = document.querySelector(".showIframe");

if (addressIframe.value){
    showIframe.innerHTML = `<div>${addressIframe.value}</div>`;
    showIframe.classList.remove('d-none');
}

addressIframe.addEventListener('change',()=>{
    console.log('change')
    if (addressIframe.value){
        showIframe.classList.remove('d-none')
        showIframe.innerHTML = addressIframe.value;
    }else showIframe.classList.add('d-none')
})