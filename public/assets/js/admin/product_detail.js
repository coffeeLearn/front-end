const productId = window.location.pathname.split('/').at(-1);

const selectCategory = document.querySelector('.select-category');
const selectTaste = document.querySelector('.select-taste');
const selectOrigin = document.querySelector('.select-origin');
const inputName = document.querySelector('.input-name');
const inputPrice = document.querySelector('.input-price');
const inputSalePercent = document.querySelector('.input-sale-percent');
const inputAmounut = document.querySelector('.input-amount');
const inputMainImg = document.querySelector('.input-main-img');
const inputSubImg = document.querySelector('.input-sub-img');
const inputDescription = document.querySelector('.input-description');
const selectShow = document.querySelector('.select-show');
const form = document.querySelector('#updateItemForm');

fetch('http://kdt-sw-5-team07.elicecoding.com:3000/products')
    .then((response) => response.json())
    .then((data) => {
        // 상품 목록 중 찾고자 하는 상품을 id로 필터링하여 선택
        const product = data.filter((item) => {
            return item._id === productId;
        })[0];

        //상품 정보를 채움
        selectCategory.value = product.category;
        selectTaste.value = product.taste;
        selectOrigin.value = product.origin;
        inputName.value = product.name;
        inputPrice.value = product.price;
        inputSalePercent.value = product.salePercent;
        inputAmounut.value = product.amount;
        inputDescription.value = product.description;
        selectShow.value = product.show;
        //document.querySelector('.input-main-img').src = product.mainImg;
        // document.querySelector('.input-sub-img').src = product.subImg;

        checkCategory(product.category);
    })
    .catch((error) => console.log(error));

function handleChangeCategory() {
    const select = document.querySelector('.select-category');

    checkCategory(select.value);
}

function checkCategory(target) {
    if (target === '커피') {
        document.querySelector('.select-taste').disabled = false;
        document.querySelector('.select-origin').disabled = false;
    } else {
        document.querySelector('.select-taste').disabled = true;
        document.querySelector('.select-origin').disabled = true;
    }
}

//상품 수정후 전송

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const category = selectCategory.value;
    const taste = selectTaste.value;
    const origin = selectOrigin.value;
    const name = inputName.value;
    const price = inputPrice.value;
    const salePercent = inputSalePercent.value;
    const amount = inputAmounut.value;
    const mainImg = inputMainImg.files[0];
    console.log(inputMainImg.files[0]);
    const subImg = inputSubImg.files[0];
    const description = inputDescription.value;
    const show = selectShow.value;

    const product = JSON.stringify({
        category,
        taste,
        origin,
        name,
        price,
        salePercent,
        amount,
        description,
        show,
    });

    const payload = new FormData();
    payload.append('data', product);
    payload.append('main', mainImg);
    payload.append('sub', subImg);

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://kdt-sw-5-team07.elicecoding.com:3000/products/admin/${productId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: payload,
        });

        if (!res.ok) {
            throw new Error('상품 수정에 실패했습니다.');
        }
        alert('상품수정이 완료 되었습니다.');

        const result = await res.json();
        console.log('업로드 결과:', result);
    } catch (error) {
        console.error(error);
    }
});
