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
    const itemBox = document.getElementById(itemBoxId);
    itemBox.innerHTML = '';

    products.forEach((product) => {
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

// 탭을 클릭했을 때 상품 표시
function displayProductsByTaste(products, taste, itemBoxId) {
    const filteredProducts = products.filter((product) => product.category === '커피' && product.taste === taste);
    displayProducts(filteredProducts, itemBoxId);

    // 모든 탭에서 "on" 클래스 제거
    const tabLabels = document.querySelectorAll('.tab-label');
    tabLabels.forEach((label) => {
        label.classList.remove('on');
    });

    // 클릭한 탭에 "on" 클래스 추가
    const clickedTabLabel = document.querySelector(`.tab-label input[data-taste="${taste}"]`).parentElement;
    clickedTabLabel.classList.add('on');
}

// 페이지 로드 시 상품 표시
window.onload = async () => {
    const itemBoxId = 'pickItemBox';

    try {
        //커피 상품의 개수 표시
        const products = await getProducts();
        const coffeeProducts = products.filter((product) => product.category === '커피');
        displayProducts(coffeeProducts, itemBoxId);

        const productsCountEl = document.querySelector('.productsCount');
        productsCountEl.innerHTML = coffeeProducts.length;

        // 탭 클릭 이벤트 처리
        const tabLabels = document.querySelectorAll('.tab-label');
        tabLabels.forEach((label) => {
            const input = label.querySelector('input');
            const taste = input.getAttribute('data-taste');

            label.addEventListener('click', (event) => {
                displayProductsByTaste(coffeeProducts, taste, itemBoxId);

                // 화면 맨 위로 올라가는 기본 동작 방지
                event.preventDefault();

                // 모든 탭에서 "on" 클래스 제거
                tabLabels.forEach((tabLabel) => {
                    tabLabel.classList.remove('on');
                });

                // 클릭한 탭에 "on" 클래스 추가
                label.classList.add('on');
            });

            // input의 checked 상태에 따라 아이콘 변경 ** 동작 안함
            input.addEventListener('change', () => {
                const icon = label.querySelector('.material-icons');
                if (input.checked) {
                    icon.innerText = 'radio_button_checked';
                } else {
                    icon.innerText = 'radio_button_unchecked';
                }
            });
        });
    } catch (error) {
        console.error('상품을 가져오는 동안 오류가 발생했습니다:', error);
    }
};
