// 상품 데이터 호출
function getProducts() {
    return fetch('http://coffee-learn.mooo.com/api/products').then((res) => res.json());
}

// salePrice를 계산하는 함수
function calculateSalePrice(originPrice, salePercent) {
    if (salePercent === 0 || salePercent === undefined) {
        return originPrice;
    } else {
        return Math.round((originPrice - (originPrice * salePercent) / 100) / 10) * 10;
    }
}

// 상품 정보 업데이트 함수
function updateProductInfo(product) {
    const productName = document.querySelector('.item-name');
    const salePercent = document.querySelector('.sale-percent');
    const salePrice = document.querySelector('.sale-price');
    const originPrice = document.querySelector('.origin-price');
    const amountCount = document.querySelector('.amount-count');
    const productMainImg = document.querySelector('.main-img');
    const productSubImg = document.querySelector('.sub-img');
    const originPriceWrap = document.querySelector('.origin-price-wrap');
    const itemDiscount = document.querySelector('.item-discount');

    // 이미지 src 업데이트
    productMainImg.src = product.mainImg;
    productMainImg.alt = product.name;
    productSubImg.src = product.subImg;
    productSubImg.alt = product.name;

    // name 업데이트
    productName.innerText = product.name;

    // salePercent 업데이트
    salePercent.innerText = product.salePercent || 0;

    // originPrice 업데이트
    originPrice.innerText = product.price.toLocaleString();

    // salePrice 계산 및 업데이트
    const calculatedSalePrice = calculateSalePrice(product.price, product.salePercent);
    salePrice.innerText = calculatedSalePrice.toLocaleString();

    // amountCount 업데이트
    amountCount.innerText = product.amount;

    // salePercent가 0인 경우 클래스 추가
    if (product.salePercent === 0) {
        originPriceWrap.classList.add('on');
        itemDiscount.classList.add('on');
    }
}

// 수량 버튼 이벤트 핸들러
function handleAmountButtons() {
    const amountCount = document.querySelector('.amount-count');
    const upButton = document.querySelector('.up-btn');
    const downButton = document.querySelector('.down-btn');
    const salePrice = document.querySelector('.sale-price');
    const total = document.querySelector('.total-price');

    // upButton 클릭 시
    upButton.addEventListener('click', () => {
        let count = parseInt(amountCount.innerText);
        count += 1;
        amountCount.innerText = count;

        // downButton 활성화
        if (count > 1) {
            downButton.removeAttribute('disabled');
        }

        // totalPrice 계산 및 업데이트
        const totalPrice = count * parseInt(salePrice.innerText.replace(/,/g, ''));
        total.innerText = totalPrice.toLocaleString();
    });

    // downButton 클릭 시
    downButton.addEventListener('click', () => {
        let count = parseInt(amountCount.innerText);

        // count가 1 이상일 때만 감소
        if (count > 1) {
            count -= 1;
            amountCount.innerText = count;

            // totalPrice 계산 및 업데이트
            const totalPrice = count * parseInt(salePrice.innerText.replace(/,/g, ''));
            total.innerText = totalPrice.toLocaleString();
        }

        // downButton 비활성화
        if (count === 1) {
            downButton.setAttribute('disabled', true);
        }
    });
}

// 초기화 함수
function init() {
    const path = window.location.pathname;
    const pathNumber = path.split('/items/coffee_learn/')[1];

    // 데이터 가져오기
    getProducts().then((products) => {
        const product = products.find((product) => product._id === pathNumber);
        updateProductInfo(product); // 상품 정보 업데이트
        updateTotalPrice(product); // totalPrice 업데이트
    });

    // 수량 버튼 이벤트 처리
    handleAmountButtons();
}

// totalPrice 업데이트 함수
function updateTotalPrice(product) {
    const total = document.querySelector('.total-price');
    const salePrice = document.querySelector('.sale-price');

    // totalPrice 계산
    const totalPrice = product.amount * parseInt(salePrice.innerText.replace(/,/g, ''));

    // total 업데이트
    total.innerText = totalPrice.toLocaleString();
}

// 탭 메뉴 전환(상품정보, 상품푸기, 상품문의 탭)
function handleTabMenuClick() {
    const tabMenus = document.querySelectorAll('.tab-menu input[type="radio"]');
    const tabCons = document.querySelectorAll('.tab-con');

    tabMenus.forEach(function (menu, index) {
        menu.addEventListener('click', function () {
            // Remove 'on' class from all tab-cons
            tabCons.forEach(function (tabCon) {
                tabCon.classList.remove('on');
            });

            const conNumber = index + 1;
            const targetTabCon = document.querySelector('.tab-con.con' + conNumber);
            targetTabCon.classList.add('on');
        });
    });
}

// btn-confirm 클릭 시 로컬 스토리지에 장바구니 정보 저장
const btnGoCart = document.querySelector('.btn-confirm');

// 장바구니 초기화 함수
function resetCart() {
    const amountCount = document.querySelector('.amount-count');
    const optionSelect = document.querySelector('select[name="optionSnoInput"]');

    // amountCount와 optionSelect 초기화
    amountCount.innerText = '1';
    optionSelect.selectedIndex = 0;
}

// 장바구니로 이동 버튼 클릭 시 이벤트 처리
btnGoCart.addEventListener('click', function () {
    const optionSelect = document.querySelector('select[name="optionSnoInput"]');

    // 로컬 스토리지에 저장
    saveToLocalStorage();

    // 장바구니 초기화
    resetCart();

    // "/cart"로 리다이렉트
    window.location.href = '/cart';
});

// 구매하기 클릭 시 이벤트 처리
const buyNowBtn = document.getElementById('buyNowBtn');
buyNowBtn.addEventListener('click', function () {
    window.location.href = '/cart';
});

// 로컬 스토리지에 저장하는 함수 수정
function saveToLocalStorage() {
    const productName = document.querySelector('.item-name').innerText;
    const amountCount = parseInt(document.querySelector('.amount-count').innerText);
    const totalPrice = parseInt(document.querySelector('.total-price').innerText.replace(/,/g, ''));
    const optionSelect = document.querySelector('select[name="optionSnoInput"]');
    const option = optionSelect.value;

    const cartItem = {
        productName: productName,
        amount: amountCount,
        totalPrice: totalPrice,
        option: option,
        salePrice: totalPrice / amountCount,
    };

    let cartItems = localStorage.getItem('cartItems');
    if (cartItems) {
        cartItems = JSON.parse(cartItems);
        cartItems.push(cartItem);
    } else {
        cartItems = [cartItem];
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// 모달창 열고 닫기
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const optionSelectBox = document.querySelector('.option-select-box');
const btnCancel = document.querySelector('.btn-cancel');
const cartBackground = document.querySelector('.cart-modal-bg');

// cartBtn 클릭 시 실행되는 함수
cartBtn.addEventListener('click', function () {
    const optionSelect = document.querySelector('select[name="optionSnoInput"]');
    const option = optionSelect.value.trim(); // trim() 메서드를 사용하여 공백을 제거하고 할당

    // 분쇄 옵션이 공백이라면 alert 메시지 띄우기
    if (option === '') {
        alert('☕ 분쇄 옵션을 선택하세요.');
        return;
    }

    cartModal.classList.add('on');
});

// btn-cancel, cartBackground 클릭 시 on 클래스 제거 및 장바구니 초기화
function closeModalAndResetCart() {
    cartModal.classList.remove('on');
    resetCart();
}

// btn-cancel 클릭 시 on 클래스 제거 및 장바구니 초기화
btnCancel.addEventListener('click', closeModalAndResetCart);

// cartBackground 클릭 시 on 클래스 제거 및 장바구니 초기화
cartBackground.addEventListener('click', closeModalAndResetCart);

window.onload = function () {
    handleTabMenuClick();
    init();
};
