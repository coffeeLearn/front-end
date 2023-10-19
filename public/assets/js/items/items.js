// 상품 데이터 호출
function getProducts() {
    return fetch('http://coffee-learn.mooo.com/api/products').then((res) => res.json());
}

// 공통 함수: 상품 할인 가격 계산
function calculateSalePrice(product, amountCount) {
    const { price, salePercent } = product;
    const salePrice = Math.round((price - (price * salePercent) / 100) / 10) * 10;
    return salePrice * amountCount;
}

// 상품을 그리드에 표시
function displayProducts(products, itemBoxId) {
    const filteredProducts = products.filter(({ category }) => category !== '');
    const itemBox = document.getElementById(itemBoxId);
    itemBox.innerHTML = '';

    // 상품 Element 생성
    filteredProducts.forEach((product) => {
        const { _id, description, name, price, category, salePercent, mainImg } = product;

        const mainImgSrc = mainImg;
        const amountCount = 1;
        const salePrice = calculateSalePrice(product, amountCount);

        const originPriceEl = generatePriceEl(price, category);
        const salePriceEl = generateSalePriceEl(price, category, salePercent);

        // 원가를 표시하는 함수
        function generatePriceEl(price, category) {
            // 커피 카테고리는 할인하지 않으므로 공백처리
            if (category === '커피') return '';
            return `<p class='price'>${price.toLocaleString()}원</p>`;
        }

        // 할인가(판매가)를 표시하는 함수
        function generateSalePriceEl(price, category) {
            // 커피 카테고리는 할인하지 않으므로 공백처리
            if (category === '커피') return `<p class='sale-price'>${price.toLocaleString()}원</p>`;
            return `
      <p class="sale-percent">${salePercent}%</p>
      <p class='sale-price'>${salePrice.toLocaleString()}원</p>
      `;
        }

        const itemEl = document.createElement('div');
        itemEl.classList.add('item-list');

        const itemLink = document.createElement('a');
        itemLink.href = `/items/coffee_learn/${_id}`;

        itemLink.innerHTML = `
      <div class="img-box">
        <img class="main-img" src="${mainImgSrc}" />
      </div>
      <div class="detail-box">
        <strong class="description">${description}</strong>
        <h3 class="name">${name}</h3>
    `;

        const priceBox = document.createElement('div');
        priceBox.classList.add('price-box');
        priceBox.innerHTML = `
      <div class="details">
        <div class="sale-box">
          ${salePriceEl}
        </div>
        <button class="cart-btn">
          <span class="material-symbols-outlined">shopping_cart</span>
        </button>
      </div>
      ${originPriceEl}
    `;
        itemEl.appendChild(itemLink);
        itemEl.appendChild(priceBox);
        itemBox.appendChild(itemEl);

        // 장바구니 버튼 클릭 이벤트 처리
        const cartBtn = itemEl.querySelector('.cart-btn');
        cartBtn.addEventListener('click', () => {
            const productName = itemEl.querySelector('.name').textContent;
            const salePrice = parseFloat(itemEl.querySelector('.sale-price').textContent.replace(/,/g, ''));
            showCartModal(productName, salePrice);
            addModalOnClass();
        });
    });
}

// 장바구니 모달창 안의 내용 표시
function showCartModal(productName, salePrice) {
    const cartItemName = document.querySelector('.cart-item-name');
    const cartTotalPrice = document.querySelector('.total-price');
    const amountCount = document.querySelector('.amount-count');
    const downBtn = document.querySelector('.down-btn');
    const upBtn = document.querySelector('.up-btn');

    cartItemName.innerHTML = productName;

    let quantity = 1; // 상품 수량 초기값
    let totalPrice = salePrice; // 총 가격 초기값

    amountCount.innerHTML = quantity;
    cartTotalPrice.innerHTML = totalPrice.toLocaleString() + '원';

    // 수량 증가 버튼 클릭 이벤트 처리
    upBtn.addEventListener('click', () => {
        quantity++;
        amountCount.innerHTML = quantity;
        totalPrice = salePrice * quantity;
        cartTotalPrice.innerHTML = totalPrice.toLocaleString() + '원';
    });

    // 수량 감소 버튼 클릭 이벤트 처리
    downBtn.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            amountCount.innerHTML = quantity;
            totalPrice = salePrice * quantity;
            cartTotalPrice.innerHTML = totalPrice.toLocaleString() + '원';
        }
    });
}
// 모달창 열기
function addModalOnClass() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.add('on');
}

// 모달창 닫기
function removeModalOnClass() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.remove('on');
}

// 장바구니 담기완료 모달 열고 닫기
function toggleCartContent(isVisible) {
    const cartContentWrap = document.querySelector('.cart-content-wrap');
    const cartCompleteContent = document.querySelector('.cart-complete-content');

    if (isVisible) {
        cartContentWrap.classList.add('on');
        cartCompleteContent.classList.add('on');
    } else {
        cartContentWrap.classList.remove('on');
        cartCompleteContent.classList.remove('on');
        removeModalOnClass();
    }
    initializeOptions();
}

// 공통 함수 : 장바구니 모달의 내용 초기화
function initializeOptions() {
    const optionSelect = document.querySelector('.option-select');
    const amountCount = document.querySelector('.amount-count');
    const selectMenu = optionSelect.querySelector('.select-menu');

    selectMenu.selectedIndex = 0; // 초기 선택값을 첫 번째 옵션으로 설정
    amountCount.innerHTML = 1; // 초기 수량을 1로 설정
}

// 확인 버튼 클릭 이벤트 처리
function handleConfirmBtnClick(confirmBtn) {
    console.log('handleConfirmBtnClick 호출됨');
    const selectedOption = document.querySelector('.option-select select').value;

    if (confirmBtn.id === 'btnCartConfirm') {
        if (selectedOption === '') {
            alert('☕ 분쇄 옵션을 선택하세요.');
        } else {
            const productName = document.querySelector('.cart-item-name').innerHTML;
            const quantity = parseInt(document.querySelector('.amount-count').innerHTML);
            const totalPrice = parseInt(document.querySelector('.total-price').textContent.replace(/,/g, ''));
            const option = document.querySelector('.option-select select').value;

            saveToLocalStorage(productName, quantity, totalPrice, option);
            toggleCartContent(true);
        }
    } else if (confirmBtn.id === 'btnGoCart') {
        window.location.href = '/cart';
    }
}

// 취소 버튼 클릭 이벤트 처리
function handleCancelBtnClick(btn) {
    if (btn.closest('.cart-modal-buttons.complete')) {
        toggleCartContent(false);
    } else {
        removeModalOnClass();
    }
}

// 배경 클릭 이벤트 처리
function handleCartBackgroundClick() {
    toggleCartContent(false);
}

// 저장할 정보를 localStorage에 저장하는 함수
function saveToLocalStorage(productName, amount, totalPrice, option) {
    const cartItem = {
        productName: productName,
        amount: amount,
        totalPrice: totalPrice,
        option: option,
        salePrice: totalPrice / amount,
    };

    // 이전에 저장된 장바구니 정보가 있다면 가져온 후, 새로운 상품 정보를 추가합니다.
    let cartItems = localStorage.getItem('cartItems');
    if (cartItems) {
        cartItems = JSON.parse(cartItems);
        cartItems.push(cartItem);
    } else {
        cartItems = [cartItem];
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// 페이지 로드 시 상품 표시
window.onload = async () => {
    const itemBoxId = 'pickItemBox';

    try {
        // 전체 상품의 개수 표시
        const products = await getProducts();
        const allProducts = products.filter(({ category }) => category !== '');
        displayProducts(allProducts, itemBoxId);

        const productsCountEl = document.querySelector('.productsCount');
        productsCountEl.innerHTML = allProducts.length;

        // 확인 버튼 클릭 이벤트 처리(장바구니 넣기, 장바구니 이동)
        const confirmBtns = document.querySelectorAll('.btn-confirm');
        confirmBtns.forEach((confirmBtn) => {
            confirmBtn.addEventListener('click', () => {
                handleConfirmBtnClick(confirmBtn);
            });
        });

        // 취소 버튼 클릭 이벤트 처리(장바구니 모달 닫기, 쇼핑 계속)
        const cancelBtns = document.querySelectorAll('.btn-cancel');
        cancelBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                handleCancelBtnClick(btn);
            });
        });

        // 배경 클릭 이벤트 처리(장바구니 모달 닫기)
        const cartBackground = document.getElementById('cartBackground');
        cartBackground.addEventListener('click', () => {
            handleCartBackgroundClick();
        });
    } catch (error) {
        console.error('상품을 가져오는 동안 오류가 발생했습니다:', error);
    }
};
