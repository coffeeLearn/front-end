const categoryId = window.location.pathname.split('/').at(-1);

const categoryName = document.querySelector('.category-name');
const categoryDescription = document.querySelector('.category-description');
const form = document.querySelector('#addCategoryForm');

fetch('https://coffee-learn.mooo.com/api/categories')
    .then((response) => response.json())
    .then((data) => {
        // 상품 목록 중 찾고자 하는 상품을 id로 필터링하여 선택
        const category = data.filter((item) => {
            return item._id === categoryId;
        })[0];

        //상품 정보를 채움
        categoryName.value = category.name;
        categoryDescription.value = category.description;
    })
    .catch((error) => console.log(error));

//상품 수정후 전송하기

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = categoryName.value;
    const description = categoryDescription.value;

    const category = {
        name,
        description,
    };

    const dataJson = JSON.stringify(category);

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`https://coffee-learn.mooo.com/api/categories/admin/${categoryId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: dataJson,
        });

        if (!res.ok) {
            throw new Error('수정에 실패했습니다.');
        }
        alert('수정이 완료 되었습니다.');
        window.location.href = '/admin/category';

        const result = await res.json();
        console.log('업로드 결과:', result);
    } catch (error) {
        console.error(error);
    }
});
