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
    } catch (error) {
        console.error('상품을 가져오는 동안 오류가 발생했습니다:', error);
    }
};
