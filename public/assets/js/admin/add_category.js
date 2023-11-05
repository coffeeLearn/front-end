// 입력된 내용 서버로 전송
const categoryName = document.querySelector('.category-name');
const categoryDescription = document.querySelector('.category-description');
const form = document.querySelector('#addCategoryForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = categoryName.value;
    const description = categoryDescription.value;

    if (!name || !description) {
        alert('전체 내용을 입력해 주세요.');
    }

    const category = JSON.stringify({
        name,
        description,
    });
    const dataJson = category;

    const token = localStorage.getItem('token');

    const apiUrl = 'https://coffee-learn.mooo.com/api/categories/admin';

    const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: dataJson,
    });

    if (!res.ok) {
        alert('에러가 발생했습니다.');
        return;
    }
    alert('카테고리가 등록되었습니다.');
    form.reset();
    window.location.href = '/admin/category';

    const result = await res.json();
    console.log(result);
});
