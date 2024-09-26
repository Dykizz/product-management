//Cart

// Counter
const tableCart = document.querySelector(".table-cart");
const totalMoneys = tableCart?.querySelectorAll("[totalMoney]");
const counters = document.querySelectorAll(".counter input[type='number']");
const btnUps = document.querySelectorAll(".counter .btnUp");
const btnDowns = document.querySelectorAll(".counter .btnDown");
const totalPayment = document.querySelector("[total-payment]");
const checkBoxs = tableCart?.querySelectorAll("tbody input[name='id']");

const calcPay = () => {
    if (!totalMoneys) return;
    let total = 0;
    for (let i = 0; i < totalMoneys.length; i++) {
        if (checkBoxs[i].checked)
            total += parseFloat(totalMoneys[i].innerHTML.slice(0, -1));
    }
    totalPayment.innerHTML = "Tổng thanh toán : " + total.toFixed(2) + "$";
}
calcPay();
counters.forEach((counter, index) => {
    counter.addEventListener('change', () => {
        const maxValue = parseInt(counter.max, 10);
        let value = parseInt(counter.value, 10);
        if (value > maxValue) {
            counter.value = maxValue;
            value = maxValue;
        }
        const minValue = parseInt(counter.min,10);
        if (value < minValue){
            counter.value = minValue;
            value = minValue;
        }
        const priceNew = parseFloat(totalMoneys[index].getAttribute('price-new'));
        totalMoneys[index].innerHTML = (priceNew * value).toFixed(2, 10) + "$";
        calcPay();
    });
});


btnUps.forEach((btnUp, index) => {
    btnUp.addEventListener('click', () => {
        const maxValue = parseInt(counters[index].max);
        const value = counters[index].value;
        if (value < maxValue) {
            counters[index].value = parseInt(value) + 1;
        }
        const event = new Event('change');
        counters[index].dispatchEvent(event);
    })
})
btnDowns.forEach((btnDown, index) => {
    btnDown.addEventListener('click', () => {
        const value = counters[index].value;
        if (value >= 1) {
            counters[index].value = value - 1;
        }
        const event = new Event('change');
        counters[index].dispatchEvent(event);
    })
})



// End Counter
// Check Box
const tableCheckBox = document.querySelector("[table-check-box]");
const checkAll = tableCheckBox?.querySelector("input[name='checkall']");
checkAll?.addEventListener("click", () => {
    checkBoxs?.forEach(checkbox => checkbox.checked = checkAll.checked);
    const event = new Event('change');
    counters[0].dispatchEvent(event);
})
checkBoxs?.forEach(checkbox => {
    checkbox.addEventListener("click", () => {
        if (checkbox.checked) {
            const countCheck = tableCheckBox.querySelectorAll("input[name='id']:checked").length;
            if (countCheck == checkBoxs.length) checkAll.checked = true;
        } else {
            checkAll.checked = false;
        }
        const event = new Event('change');
        counters[0].dispatchEvent(event);
    })
})

//End Check Box

// Cập nhật lại trí các sản phẩm trong cart
const updatePosition = () => {
    let positions = tableCart.querySelectorAll('[position]');
    let index = 1;
    positions.forEach(item => {
        const parentElement = item.closest('tr');
        if (!parentElement.classList.contains("d-none")) {
            item.innerText = index++;
        }
    })
}

//Button Delete
const btnDeletes = tableCart?.querySelectorAll("[btnDelete]");

btnDeletes?.forEach(btnDelete => {
    btnDelete.addEventListener('click', () => {
        btnDelete.setAttribute('clicked', true);
        let parentElement = btnDelete.closest('tr');
        if (parentElement) {
            parentElement.classList.add("d-none");
        }
        updatePosition();
    })
})
//End Button Delete
//Button Save
const btnSave = document.querySelector("[btnSave]");
const formSave = document.querySelector("#formSaveCart");
const inputData = formSave?.querySelector("input");
btnSave?.addEventListener('click', () => {
    let arr = [];
    counters.forEach((_, index) => {
        let infor = []; //checked-id-quantity || delete
        if (btnDeletes[index].getAttribute("clicked") == 'true') {
            infor.push("delete");
            infor.push(checkBoxs[index].id);
        } else {
            if (checkBoxs[index].checked) infor.push("1");
            else infor.push("0");
            infor.push(checkBoxs[index].id);
            infor.push(counters[index].value);
        }
        arr.push(infor.join('-'));
    })
    inputData.setAttribute('value',arr.join(';'));
    console.log(formSave)
    formSave.setAttribute('action','/cart/save?_method=PATCH');
    formSave.submit();

})

// End Cart


