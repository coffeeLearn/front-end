// 장바구니 상품 불러오기
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

// 이름 , 연락처 불러오기

const receiverName = document.querySelector('#receiverName');
const receiverPhone = document.querySelector('#receiverPhone');
const address = document.querySelector('#address');
const detailedAddress = document.querySelector('#detailedAddress');

async function getUserInfo() {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch('http://coffee-learn.mooo.com/api/users/mypage', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const userInfo = await res.json();

        receiverName.value = userInfo.name;
        receiverPhone.value = userInfo.phone;
        address.value = userInfo.address;
        detailedAddress.value = userInfo.detailedAddress;
    } catch (error) {
        console.log(error);
    }
}

getUserInfo();
