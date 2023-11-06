const productList = document.querySelector('#adminList');

//리스트 불러오기
insertProductElement();

async function insertProductElement() {
    try {
        const res = await fetch('https://coffee-learn.mooo.com/api/products', {
            method: 'GET',
        });
        if (!res.ok) {
            throw new Error('에러가 발생했습니다.');
        }
        const products = await res.json();
        products.reverse();

        products.forEach((product, idx) => {
            const productNumber = products.length - idx;
            const productId = product._id;
            const categoryName = product.category;
            const productName = product.name;
            const productPrice = product.price;

            productList.insertAdjacentHTML(
                'beforeend',
                `
        <tbody>
            <tr>
                <td>${productNumber}</td>
                <td>${categoryName}</td>
                <td><a href="#" class="product-name" data-product-id="${productId}" style="text-decoration: underline">${productName}</a></td>
                <td>${productPrice.toLocaleString()}원</td>
                <td><button id="${productId}" class="delete-button">상품삭제</button></td>
            </tr>
        </tbody>
        `
            );
        });

        // 상품삭제하기
        const deleteBtns = document.querySelectorAll('.delete-button');

        deleteBtns.forEach((deleteBtn) => {
            deleteBtn.addEventListener('click', async (e) => {
                const eventTarget = e.target;

                const token = localStorage.getItem('token');

                if (window.confirm('해당 상품을 삭제하시겠습니까?')) {
                    const productNumber = eventTarget.id;
                    console.log(productNumber);
                    const apiUrl = `https://coffee-learn.mooo.com/api/products/admin/${productNumber}`;

                    const res = await fetch(apiUrl, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (!res.ok) {
                        throw new Error('상품 삭제 중 에러가 발생했습니다.');
                    }
                    eventTarget.parentNode.parentNode.remove();
                    alert('상품이 삭제되었습니다.');
                }
            });
        });

        //상품 상세페이지 이동

        const productNames = document.querySelectorAll('.product-name');

        productNames.forEach((productLink) => {
            productLink.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = e.target.dataset.productId; // 상품 아이디 가져오기

                const url = `/admin/productdetails/${productId}`; // 상세 페이지 URL 생성
                window.location.href = url; // 상세 페이지로 이동
            });
        });
    } catch (error) {
        console.error(error);
        alert('에러가 발생했습니다.');
    }
}
