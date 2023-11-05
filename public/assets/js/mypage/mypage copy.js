const myOrderList = document.querySelector('#mypageList');

insertOrderElement();
async function insertOrderElement() {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch('https://coffee-learn.mooo.com/api/mypage/orders', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) {
            throw new Error('에러가 발생했습니다.');
        }
        const orders = await res.json();
        orders.reverse();

        orders.forEach((order, idx) => {
            const orderId = order._id;

            const orderNumber = orders.length - idx;
            const regDate = order.reg_date;
            const itemName = order.products[0].productName;
            const option = order.products[0].option;
            const itemCount = order.products.length;
            const totalPrice = order.totalPriceEl;
            const orderStatus = order.status;

            const isCancelled = orderStatus === '주문 취소';

            const newDate = new Date(regDate);
            const orderDate = newDate.toISOString().slice(0, 19).replace('T', ' ');

            myOrderList.insertAdjacentHTML(
                'beforeend',
                `
            <tbody>
                <tr>
                    <td class="order-number" rowspan="1">${orderNumber}</td>
                    <td class="order-date">${orderDate}</td>
                    <td class="order-item">
                        <p class="item-name">${itemName}</p>
                        <p class="option">${option} 외 ${itemCount - 1}건</p>
                    </td>
                    <td class="item-count">${itemCount}</td>
                    <td class="price">${totalPrice.toLocaleString()}원</td>
                    <td class="order-status">
                        <span>${orderStatus}</span>
                        <button class="update-button" data-order-id="${orderId}">수정</button>
                    </td>
                    <td><button id ="${orderId}" class="cancel-button"  ${
                    isCancelled ? 'disabled' : ''
                }>주문 취소</button></td>
                </tr>
            </tbody>
        `
            );
        });

        // 주문 취소하기(주문삭제)
        const cancelBtns = document.querySelectorAll('.cancel-button');

        cancelBtns.forEach((cancelBtn) => {
            cancelBtn.addEventListener('click', async (e) => {
                const eventTarget = e.target;
                const token = localStorage.getItem('token');

                if (window.confirm('해당 주문을 취소하시겠습니까?')) {
                    const orderNumber = eventTarget.id;
                    const apiUrl = `https://coffee-learn.mooo.com/api/mypage/orders/cancel/${orderNumber}`;
                    const res = await fetch(apiUrl, {
                        method: 'PUT',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!res.ok) {
                        throw new Error('주문 취소중 에러가 발생했습니다.');
                    }
                    alert('주문이 취소 되었습니다.');
                    location.reload();
                }
            });
        });
    } catch (error) {
        console.log(error);
    }
}
