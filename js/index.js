"use strict";
const localStorageKey = "ProductsList";
const local_storage = JSON.parse(localStorage.getItem(localStorageKey));
const itemsSection = document.querySelector(".items-Section");
const productName = document.querySelector("#productName");
const productCategory = document.querySelector("#productCategory");
const productPrice = document.querySelector("#productPrice");
const productImgDecoy = document.querySelector("#productImgDecoy");
const productImg = document.querySelector("#productImg");
const productDescription = document.querySelector("#productDescription");
const addBtn = document.querySelector("#addBtn");
const updateBtn = document.querySelector("#updateBtn");
const productSearch = document.querySelector("#productSearch");
let products = [];
const inputs = [
    productName,
    productCategory,
    productPrice,
    productImg,
    productDescription,
];
const productCategories = ["Phones", "Covers", "Screen Protectors"];
const regex = {
    productName: /[a-zA-Z\s]{3,15}/,
    productPrice: /^([6-9][0-9]{3}|[1-5][0-9]{4}|60000)$/,
    productDescription: /^[\w]?[\w\s]{0,249}$/,
    productCategory: new RegExp(`^(${productCategories.join("|")})$`),
    productImg: /\.(jpg|jpeg|png|gif|bmp|webp)$/i,
    imgSize: /^([0-4][0-9]{6}|5000000|[1-9][0-9]{0,5})$/,
};
for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("input", (e) => {
        setTimeout(() => {
            validateInputValue(e.target);
        }, 1000);
    });
}
if (local_storage) {
    products = local_storage;
    displayProducts(products.sort((a, b) => a.productPrice - b.productPrice));
}
productImg.addEventListener("change", (_) => {
    productImgDecoy.value = productImg.value.slice(
        productImg.value.lastIndexOf("\\") + 1
    );
});
addBtn.addEventListener("click", function () {
    validateForm(this);
});
updateBtn.addEventListener("click", function (e) {
    if (validateForm(this)) {
        products[updateBtn.index].productName = inputs[0].value;
        products[updateBtn.index].productCategory = inputs[1].value;
        products[updateBtn.index].productPrice = inputs[2].value;
        if (inputs[3].value) {
            products[
                updateBtn.index
            ].productImg = `imgs/${inputs[3].value.slice(
                inputs[3].value.lastIndexOf("\\")+1
            )}`;
        }
        products[updateBtn.index].productDescription = inputs[4].value;
        localStorage.setItem(
            localStorageKey,
            JSON.stringify(products.sort((a, b) => a.productPrice - b.productPrice))
        );
        displayProducts(products.sort((a, b) => a.productPrice - b.productPrice));
        setInputsValues();
        addBtn.classList.remove("d-none");
        updateBtn.classList.add("d-none");
    }
});
productSearch.addEventListener("input", (e) => {
    let element = e.target;
    let matchedList = [];
    for (var i = 0; i < products.length; i++) {
        if (
            products[i].productName
                .toLowerCase()
                .includes(element.value.toLowerCase())
        ) {
            matchedList.push(products[i]);
        } else {
            matchedList.push(undefined);
        }
    }
    for (var i = 0; i < matchedList.length; i++) {
        if (matchedList[i])
            matchedList[i].matchedname = matchedList[i].productName
                .toLowerCase()
                .replaceAll(
                    element.value,
                    `<span class="text-danger">${element.value}</span>`
                );
    }
    displayProducts(matchedList);
});
itemsSection.addEventListener("click", (e) => {
    let target;
    if (e.target.matches(".editBtn i")) {
        target = e.target.parentElement;
        editProduct(target);
    } else if (e.target.matches(".editBtn")) {
        target = e.target;
        editProduct(target);
    } else if (e.target.matches(".deleteBtn i")) {
        target = e.target.parentElement;
        deleteProduct(target);
    } else if (e.target.matches(".deleteBtn")) {
        target = e.target;
        deleteProduct(target);
    }
});
function validateForm(obj) {
    let flag = true;
    if (obj === addBtn) {
        for (const input of inputs) {
            if (!validateInputValue(input)) {
                flag = false;
            }
        }
        if (flag) {
            addProduct();
            setInputsValues();
        }
    } else {
        for (const input of inputs) {
            if (input == inputs[3]) {
                continue;
            }
            if (!validateInputValue(input)) {
                flag = false;
            }
        }
        return flag;
    }
}
function validateInputValue(inputElement) {
    if (inputElement === inputs[3]) {
        if (regex.imgSize.test(inputElement.files[0].size)) {
            if (!regex.productImg.test(inputElement.value)) {
                inputElement.nextElementSibling.innerHTML =
                    " not supported format";
                inputElement.classList.remove("valid");
                inputElement.classList.add("invalid");
                inputElement.nextElementSibling.classList.remove("d-none");
                return false;
            }
            inputElement.nextElementSibling.innerHTML =
                " image must be included";
            inputElement.classList.add("valid");
            inputElement.classList.remove("invalid");
            inputElement.nextElementSibling.classList.add("d-none");
            return true;
        } else {
            inputElement.nextElementSibling.innerHTML = " max size of 4.8 MB";
            inputElement.classList.remove("valid");
            inputElement.classList.add("invalid");
            inputElement.nextElementSibling.classList.remove("d-none");
            return false;
        }
    }
    if (regex[inputElement.id].test(inputElement.value)) {
        inputElement.classList.add("valid");
        inputElement.classList.remove("invalid");
        inputElement.nextElementSibling.classList.add("d-none");
        return true;
    } else {
        inputElement.classList.remove("valid");
        inputElement.classList.add("invalid");
        inputElement.nextElementSibling.classList.remove("d-none");
        return false;
    }
}
function addProduct() {
    const product = {
        productName,
        productCategory,
        productPrice,
        productImg,
        productDescription,
    };
    product.productName = inputs[0].value;
    product.productCategory = inputs[1].value;
    product.productPrice = inputs[2].value;
    product.productImg = `imgs/${inputs[3].value.slice(
        inputs[3].value.lastIndexOf("\\")+1
    )}`;
    product.productDescription = inputs[4].value;
    products.push(product);
    localStorage.setItem(
        localStorageKey,
        JSON.stringify(products.sort((a, b) => a.productPrice - b.productPrice))
    );
    displayProducts(products.sort((a, b) => a.productPrice - b.productPrice));
}
function displayProducts(list) {
    let blackBox = ``;
    for (let i = 0; i < list.length; i++) {
        if (list[i])
            blackBox += `<div class="col-md-6">
                            <figure class="item glassy-bg inner">
                                <img src="${
                                    list[i].productImg
                                }" class="img-fluid mb-1" alt="${
                list[i].productName
            }">
                                <figcaption class=' p-2'>
                                    <h2 class="fs-5 fw-bolder">${
                                        list[i].matchedname
                                            ? list[i].matchedname
                                            : list[i].productName
                                    }</h2>
                                    <p class="lead rounded-2 bg-info d-inline p-1">${
                                        list[i].productPrice
                                    }.LE</p>
                                    <p class="lead d-inline p-1">${
                                        list[i].productCategory
                                    }</p>
                                    <hr/>
                                        <p class="lead">${
                                            list[i].productDescription
                                        }</p>
                                        </figcaption>
                                        <div class="d-flex justify-content-between p-2">
                                            <button class="btn btn-warning editBtn glassy-bg p-2 px-5 text-white" index="${i}" type="submit"><i
                                                    class="fa-edit fa"></i></button>
                                            <button class="btn btn-danger deleteBtn glassy-bg p-2 px-5 text-white" index="${i}" type="submit" ><i
                                                    class="fa-trash-can fa"></i></button>
                                        </div>
                            </figure>
                        </div>`;
    }
    if (blackBox) {
        itemsSection.innerHTML = blackBox;
    } else {
        itemsSection.innerHTML = `<div class="col-12 text-center empty-msg">
                            <p>"${productSearch.value}" not found</p>
                        </div>`;
    }
}
function setInputsValues(product) {
    for (const input of inputs) {
        input.classList.remove("invalid");
        input.classList.remove("valid");
    }
    if (!product) {
        productImgDecoy.value = "";
        inputs[0].value = "";
        inputs[2].value = "";
        inputs[3].value = "";
        inputs[4].value = "";
        return;
    }

    inputs[0].value = product.productName;
    inputs[1].value = product.productCategory;
    inputs[2].value = product.productPrice;
    inputs[4].value = product.productDescription;
}
//*event delegation used
function editProduct(t) {
    setInputsValues(products[t.getAttribute("index")]);
    updateBtn.classList.remove("d-none");
    updateBtn.index = t.getAttribute("index");
    addBtn.classList.add("d-none");
}
function deleteProduct(t) {
    products.splice(t.getAttribute("index"), 1);
    localStorage.setItem(
        localStorageKey,
        JSON.stringify(products.sort((a, b) => a.productPrice - b.productPrice))
    );
    if (products.length == 0) {
        itemsSection.innerHTML = `<div class="col-12 text-center empty-msg">
                            <p>No Products Available</p>
                        </div>`;
    } else {
        displayProducts(products.sort((a, b) => a.productPrice - b.productPrice));
    }
}
