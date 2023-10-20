function createProductElements() {
    let cartItems = JSON.parse(localStorage.getItem('cartItems'));

    cartItems.forEach((item) => {
        const productEl = document.createElement('li');
        productEl.classList.add('order-list-el');

        productEl.innerHTML = `
        <div class="product-txt">
            <p class="product-name">${item.productName}</p>
            <span class="product-option">옵션: ${item.option}</span>
        </div>
        <div class="product-price">
            <em class="salePrice">${item.salePrice}원</em>
            <span>x</span>
            <em class="amount">${item.amount}개</em>
        </div>
        `;

        document.querySelector('.order-list').appendChild(productEl);
    });
}

let paymentItems = JSON.parse(localStorage.getItem('paymentItems'));
const totalOrderPrice = document.querySelector('#totalOrderPrice');
const totalProductPrice = document.querySelector('#totalProductPrice');
const deliveryPrice = document.querySelector('#deliveryPrice');

totalOrderPrice.innerHTML = paymentItems.totalPriceElement;
totalProductPrice.innerHTML = paymentItems.originPrice;
deliveryPrice.innerHTML = paymentItems.deliveryFee + '원';
createProductElements();
