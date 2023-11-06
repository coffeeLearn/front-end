// 상품 데이터를 가져오는 함수
function getProducts() {
    return fetch('https://coffee-learn.mooo.com/api/products').then((res) => res.json());
}

// 상품 할인 가격을 계산하는 함수
function calculateSalePrice(product, amountCount) {
    const { price, salePercent } = product;
    const salePrice = Math.round((price - (price * salePercent) / 100) / 10) * 10;
    return salePrice * amountCount;
}

// 상품을 그리드에 표시하는 함수
function displayProducts(products, itemBoxId) {
    const itemBox = document.getElementById(itemBoxId);
    itemBox.innerHTML = '';

    products.forEach((product) => {
        const { _id, description, name, price, category, salePercent, mainImg } = product;

        const mainImgSrc = mainImg;
        const amountCount = 1;
        const salePrice = calculateSalePrice(product, amountCount);
        const salePriceEl = generateSalePriceEl();

        // 할인가(판매가)를 표시하는 함수
        function generateSalePriceEl() {
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
     <p class='price'>${price.toLocaleString()}원</p>
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
function displayProductsByPrice(products, priceRange, itemBoxId) {
    let filteredProducts;

    if (priceRange === 'under-20000') {
        filteredProducts = products.filter(
            (product) => product.category === '선물세트' && calculateSalePrice(product, 1) < 20000
        );
    } else if (priceRange === '20000-30000') {
        filteredProducts = products.filter(
            (product) =>
                product.category === '선물세트' &&
                calculateSalePrice(product, 1) >= 20000 &&
                calculateSalePrice(product, 1) < 30000
        );
    } else if (priceRange === 'over-30000') {
        filteredProducts = products.filter(
            (product) => product.category === '선물세트' && calculateSalePrice(product, 1) >= 30000
        );
    }

    displayProducts(filteredProducts, itemBoxId);

    // 모든 탭에서 "on" 클래스 제거
    const tabLabels = document.querySelectorAll('.tab-label');
    tabLabels.forEach((label) => {
        label.classList.remove('on');
    });

    // 클릭한 탭에 "on" 클래스 추가
    const clickedTabLabel = document.querySelector(`.tab-label input[data-price="${priceRange}"]`).parentElement;
    clickedTabLabel.classList.add('on');
}

window.onload = async function () {
    const itemBoxId = 'pickItemBox';

    try {
        // 상품 데이터를 가져옴
        const products = await getProducts();

        // 선물세트 상품만 필터링하여 표시
        const giftSetProducts = products.filter((product) => product.category === '선물세트');
        displayProducts(giftSetProducts, itemBoxId);

        // 선물세트 상품 개수를 표시하는 요소를 가져와 개수를 설정
        const productsCountEl = document.querySelector('.productsCount');
        productsCountEl.innerHTML = giftSetProducts.length;

        // 탭 레이블을 가져와 이벤트를 처리
        const tabLabels = document.querySelectorAll('.tab-label');
        tabLabels.forEach((label) => {
            const input = label.querySelector('input');
            const priceRange = input.getAttribute('data-price');

            label.addEventListener('click', (event) => {
                displayProductsByPrice(giftSetProducts, priceRange, itemBoxId);

                // 화면 맨 위로 올라가는 기본 동작 방지
                event.preventDefault();
            });

            // input의 checked 상태에 따라 아이콘 변경
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
