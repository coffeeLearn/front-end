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
