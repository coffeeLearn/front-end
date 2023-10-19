// 상품 데이터 호출
function getProducts() {
    return fetch('http://coffee-learn.mooo.com/api/products').then((res) => res.json());
}

// 공통 함수: 상품 할인가격 표시 Element 생성
function generatePriceEl(price, category) {
    // 커피 카테고리는 할인하지 않으므로 공백처리
    if (category === '커피') return '';
    return `<p class="price">${price.toLocaleString()}원</p>`;
}

// 공통 함수: 상품 할인 가격 계산
function calculateSalePrice(product, amountCount) {
    const { price, salePercent } = product;
    const salePrice = Math.round((price - (price * salePercent) / 100) / 10) * 10;
    return salePrice * amountCount;
}

// 공통 함수: 상품 Element 생성
function createProductElement(product, itemBoxId) {
    const { _id, description, name, price, category, salePercent, mainImg } = product;

    const mainImgSrc = mainImg;
    const amountCount = 1;
    const salePrice = calculateSalePrice(product, amountCount);
    const originPriceEl = generatePriceEl(price, category);
    const salePercentEl = generatePriceEl(salePercent, category);

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
    </div>
  `;

    const priceBox = document.createElement('div');
    priceBox.classList.add('price-box');
    priceBox.innerHTML = `
    <div class="details">
      <p class="sale-price">${salePrice.toLocaleString()}원</p>
      <button class="cart-btn">
        <span class="material-symbols-outlined">shopping_cart</span>
      </button>
      ${product.salePercent === 0 ? originPriceEl : salePercentEl}
    </div>
  `;

    itemEl.appendChild(itemLink);
    itemEl.appendChild(priceBox);
    document.getElementById(itemBoxId).appendChild(itemEl);

    // 장바구니 버튼 클릭 이벤트 처리
    const cartBtn = itemEl.querySelector('.cart-btn');
    cartBtn.addEventListener('click', () => {
        const productName = itemEl.querySelector('.name').textContent;
        const salePrice = parseFloat(itemEl.querySelector('.sale-price').textContent.replace(/,/g, ''));
        showCartModal(productName, salePrice);
        addModalOnClass();
    });
}

// 상품 데이터 호출
function getProducts() {
    return fetch('http://coffee-learn.mooo.com/api/products').then((res) => res.json());
}

// 공통 함수: 상품 목록 표시
// condition은 커피 카테고리여부를 확인하기 위함
function displayProductList(products, itemBoxId, condition) {
    const itemBox = document.getElementById(itemBoxId);
    itemBox.innerHTML = '';

    const filteredProducts = products.filter(condition);

    // 상품은 최대 4개까지만 불러오기
    filteredProducts.slice(0, 4).forEach((product) => {
        createProductElement(product, itemBoxId);
    });
}

// 커피 카테고리인지 확인
function isCoffeeCategory(product) {
    return product.category === '커피';
}

// 탭을 클릭했을 때 맛 분류에 따라 상품 표시
function displayProductsByTaste(products, taste, itemBoxId) {
    const filteredProducts = products.filter((product) => {
        if (taste === '블렌드') {
            return isCoffeeCategory(product) && product.origin === '블렌드' && product.taste !== '달콤 쌉싸름';
        }
        return isCoffeeCategory(product) && product.taste === taste;
    });

    displayProductList(filteredProducts, itemBoxId, isCoffeeCategory);
}

// 탭 상태 업데이트(css 작업을 위해 'on'클래스 추가)
function updateTabState(label, input) {
    if (input.checked) {
        label.classList.add('on');
    } else {
        label.classList.remove('on');
    }
}

// 나라별 상품은 최대 2개까지만 불러오기
function displayOriginItems(products, origin, originId) {
    const originList = document.getElementById(originId);
    const originItems = originList.querySelector('.origin-items');
    originItems.innerHTML = '';

    const filteredProducts = products.filter((product) => product.origin === origin);

    filteredProducts.slice(0, 2).forEach((product) => {
        const mainImgSrc = product.mainImg;

        const originItem = document.createElement('li');
        originItem.classList.add('origin-item-list');

        const itemLink = document.createElement('a');
        itemLink.href = `/items/coffee_learn/${product._id}`;

        itemLink.innerHTML = `
        <div class="prod-img">
          <img src="${mainImgSrc}" alt="${product.name}" />
        </div>
        <p class="item-name name">${product.name}</p>
        <span class="material-symbols-outlined click-icon">left_click</span>
      `;

        originItem.appendChild(itemLink);
        originItems.appendChild(originItem);
    });
}

// 선물 상품은 최대 5개까지만 불러오기
function displayGiftProducts(products) {
    const giftSwiperWrapper = document.getElementById('giftSwiperWrapper');
    giftSwiperWrapper.innerHTML = '';

    const giftProducts = products.filter((product) => product.category === '선물세트');

    giftProducts.slice(0, 5).forEach((product) => {
        const giftSlide = document.createElement('div');
        giftSlide.classList.add('swiper-slide');

        const itemLink = document.createElement('a');
        itemLink.href = `/items/coffee_learn/${product._id}`;

        const giftImage = document.createElement('img');
        giftImage.src = product.mainImg;
        giftImage.alt = `선물세트 추천: ${product.name}`;

        itemLink.appendChild(giftImage);
        giftSlide.appendChild(itemLink);
        giftSwiperWrapper.appendChild(giftSlide);

        const giftName = document.createElement('p');
        giftName.className = 'gift-name';
        giftName.innerHTML = product.name;
        giftSlide.appendChild(giftName);
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

// 확인 버튼 클릭 이벤트 처리
function handleConfirmBtnClick(confirmBtn) {
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
