
const btnOrder = document.querySelector('[order]');
const formInfor = document.getElementById('formInfor');

btnOrder.addEventListener('click',() => {
    const fullName = document.getElementById('fullName');
    const phone = document.getElementById('phone');
    const address = document.getElementById('addresss');
    if (!fullName || !phone || !address){
        err_m
    }
    formInfor.submit();
})