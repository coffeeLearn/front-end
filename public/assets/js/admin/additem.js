//카테고리별 선택사항 비활성화 처리
const category = document.querySelector('.select-category');

category.addEventListener('change', () => {
    const tasteField = document.querySelector('.select-taste');
    const originField = document.querySelector('.select-origin');

    if (category.value === '커피') {
        tasteField.removeAttribute('disabled');
        originField.removeAttribute('disabled');
    } else {
        tasteField.setAttribute('disabled', true);
        originField.setAttribute('disabled', true);
    }
});

// 입력된 내용 서버로 전송
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
const form = document.querySelector('#addItemForm');

const filesizeCheck = () => {
    const limitSize = 1024 * 1024;
    const mainImgSize = inputMainImg.files[0] ? inputMainImg.files[0].size : 0;
    const subImgSize = inputSubImg.files[0] ? inputSubImg.files[0].size : 0;
    if (mainImgSize > limitSize) {
        alert('이미지 용량이 너무 큽니다. 1MB 미만의 이미지를 선택해주세요.');
    }

    if (subImgSize > limitSize) {
        alert('설명(이미지) 용량이 너무 큽니다. 1MB 미만의 이미지를 선택해주세요.');
    }
};

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    filesizeCheck();

    const category = selectCategory.value;
    const taste = selectTaste.value;
    const origin = selectOrigin.value;
    const name = inputName.value;
    const price = inputPrice.value;
    const salePercent = inputSalePercent.value;
    const amount = inputAmounut.value;
    const mainImg = inputMainImg.files[0];
    const subImg = inputSubImg.files[0];
    const description = inputDescription.value;
    const show = selectShow.value;

    if (!category || !name || !price || !amount || !mainImg || !subImg || !description || !show) {
        alert('전체 항목을 입력해 주세요.');
        return;
    }

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

    const token = localStorage.getItem('token');
    const apiUrl = 'https://coffee-learn.mooo.com/api/products/admin';

    const payload = new FormData();
    payload.append('data', product);
    payload.append('main', mainImg);
    payload.append('sub', subImg);

    const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: payload,
    });

    if (!res.ok) {
        alert('에러가 발생했습니다.');
        return;
    }
    alert('상품이 등록되었습니다.');

    form.reset();
    window.location.href = '/admin/product';
});
