const categoryList = document.querySelector('#adminList');

//리스트 불러오기
insertCategoryElement();

async function insertCategoryElement() {
    try {
        const res = await fetch('http://kdt-sw-5-team07.elicecoding.com:3000/categories', {
            method: 'GET',
        });
        if (!res.ok) {
            throw new Error('에러가 발생했습니다.');
        }
        const categories = await res.json();
        categories.reverse();

        categories.forEach((category, index) => {
            const categoryNumber = categories.length - index;
            const categoryId = category._id;
            const categoryName = category.name;
            const categoryDescription = category.description;

            categoryList.insertAdjacentHTML(
                'beforeend',
                `
                <tbody>
                <tr>
                    <td class="category-number">${categoryNumber}</td>
                    <td>
                        <a href="#" class="category-name" data-category-id="${categoryId}"style = "text-decoration:underline">${categoryName}</a>
                    </td>
                    <td class="category-description">${categoryDescription}</td>
                    <td><button id="${categoryId}" class="delete-button">삭제</button></td>
                </tr>
            </tbody>
        `
            );
        });

        // 카테고리 삭제하기
        const deleteBtns = document.querySelectorAll('.delete-button');

        deleteBtns.forEach((deleteBtn) => {
            deleteBtn.addEventListener('click', async (e) => {
                const eventTarget = e.target;

                const token = localStorage.getItem('token');

                if (window.confirm('해당 상품을 삭제하시겠습니까?')) {
                    const categoryId = eventTarget.id;
                    const apiUrl = `http://kdt-sw-5-team07.elicecoding.com:3000/categories/admin/${categoryId}`;

                    const res = await fetch(apiUrl, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (!res.ok) {
                        throw new Error('상품 삭제 중 에러가 발생했습니다.');
                    }
                    eventTarget.parentNode.parentNode.remove();
                }
            });
        });

        //카테고리 상세페이지 이동

        const categoryNames = document.querySelectorAll('.category-name');

        categoryNames.forEach((categoryLink) => {
            categoryLink.addEventListener('click', (e) => {
                e.preventDefault();
                const categoryId = e.target.dataset.categoryId;
                console.log(categoryId);
                const url = `/admin/categorydetails/${categoryId}`; // 상세 페이지 URL 생성
                window.location.href = url; // 상세 페이지로 이동
            });
        });
    } catch (error) {
        console.error(error);
        alert('에러가 발생했습니다.');
    }
}
