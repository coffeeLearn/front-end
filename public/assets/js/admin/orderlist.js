const orderList = document.querySelector('#adminList');
const orderStep = document.querySelector('.order-step');

insertOrderElement();

async function insertOrderElement() {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch('http://coffee-learn.mooo.com/api/admin/orders', {
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

        // 주문 상태 현황 불러오기

        orderStep.insertAdjacentHTML(
            'beforeend',
            `
            <li>
            <p id="total-order-count">${orders.length}</p>
            <span>총주문수</span>
        </li>
        <li>
            <p id="payment-complete-count">0</p>
            <span>결제완료</span>
        </li>
        <li>
            <p id="preparing-count">0</p>
            <span>상품준비중</span>
        </li>
        <li>
            <p id="shipping-count">0</p>
            <span>상품배송중</span>
        </li>
        <li>
            <p id="completed-count">0</p>
            <span>배송완료</span>
        </li>
            `
        );

        const orderStatuses = ['결제 완료', '상품준비중', '배송준비중', '배송완료'];

        orders.forEach((order, idx) => {
            const orderId = order._id;
            const orderNumber = orders.length - idx;
            const regDate = order.reg_date;
            const itemName = order.products[0].productName;
            const option = order.products[0].option;
            const itemCount = order.products.length;
            const totalPrice = order.totalPriceEl;
            const orderStatus = order.status;
            const userName = order.userName;

            const newDate = new Date(regDate);
            const orderDate = newDate.toISOString().slice(0, 19).replace('T', ' ');

            if (orderStatus === '결제 완료') {
                const countElement = document.getElementById('payment-complete-count');
                if (countElement) {
                    countElement.textContent++;
                }
            } else if (orderStatus === '상품준비중') {
                const countElement = document.getElementById('preparing-count');
                if (countElement) {
                    countElement.textContent++;
                }
            } else if (orderStatus === '배송준비중') {
                const countElement = document.getElementById('shipping-count');
                if (countElement) {
                    countElement.textContent++;
                }
            } else if (orderStatus === '배송완료') {
                const countElement = document.getElementById('completed-count');
                if (countElement) {
                    countElement.textContent++;
                }
            }

            //리스트 불러오기

            orderList.insertAdjacentHTML(
                'beforeend',
                `
                <tbody>
                <tr>
                    <td class="order-number" rowspan="1">${orderNumber}</td>
                    <td class="order-date">${orderDate}</td>
                    <td class="user">${userName}</td>
                    <td class="order-item">
                        <p class="item-name">${itemName}</p>
                        <p class="option">${option} 외 ${itemCount - 1}건</p>
                    </td>
                    <td class="item-count">${itemCount}</td>
                    <td class="price">${totalPrice.toLocaleString()}원</td>
                    <td class="order-status">
                        <select class="order-status-select">
                        ${orderStatuses
                            .map(
                                (status) => `
                        <option value="${status}" ${orderStatus === status ? 'selected' : ''}>${status}</option>
                    `
                            )
                            .join('')}
                        </select>
                        <button class="update-button" data-order-id="${orderId}">수정</button>
                    </td>
                    <td><button id ="${orderId}" class="cancel-button">주문 취소</button></td>
                </tr>
            </tbody>
        `
            );
        });

        // 주문 상태 수정하기
        const updateBtns = document.querySelectorAll('.update-button');

        updateBtns.forEach((updateBtns) => {
            updateBtns.addEventListener('click', async (e) => {
                const orderId = e.target.dataset.orderId;
                const selectElement = e.target.previousElementSibling;
                const selectedStatus = selectElement.value;

                try {
                    const apiUrl = `http://coffee-learn.mooo.com/api/admin/orders/${orderId}`;
                    const token = localStorage.getItem('token');
                    const res = await fetch(apiUrl, {
                        method: 'PUT',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ status: selectedStatus }),
                    });

                    if (!res.ok) {
                        throw new Error('상태 변경 중 에러가 발생했습니다.');
                    }
                } catch (error) {
                    console.error(error);
                    alert('상태 변경 중 에러가 발생했습니다.');
                }
                alert('상태가 변경되었습니다.');
                location.reload();
            });
        });

        // 주문 취소하기(주문삭제)
        const cancelBtns = document.querySelectorAll('.cancel-button');

        cancelBtns.forEach((cancelBtn) => {
            cancelBtn.addEventListener('click', async (e) => {
                const eventTarget = e.target;
                const token = localStorage.getItem('token');

                if (window.confirm('해당 주문을 취소하시겠습니까?')) {
                    const orderNumber = eventTarget.id;
                    const apiUrl = `http://coffee-learn.mooo.com/api/admin/orders/${orderNumber}`;
                    const res = await fetch(apiUrl, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!res.ok) {
                        throw new Error('주문 취소중 에러가 발생했습니다.');
                    }
                    eventTarget.parentNode.parentNode.remove();
                    alert('주문이 취소 되었습니다.');
                    location.reload();
                }
            });
        });
    } catch (error) {
        console.error(error);
        alert('에러가 발생했습니다.');
    }
}
