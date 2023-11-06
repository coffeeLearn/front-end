const myOrderList = document.querySelector('#mypageList');
const orderStep = document.querySelector('.order-step');

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
            <span>결제 완료</span>
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
        <li>
            <p id="canceled-count">0</p>
            <span>주문 취소</span>
        </li>
        `
        );

        document.querySelector('.total-orders').innerHTML = `내역 총 ${orders.length}건`;

        orders.forEach((order, idx) => {
            const orderId = order._id;
            const orderNumber = orders.length - idx;
            const regDate = order.reg_date;
            const itemName = order.products[0].productName;
            const option = order.products[0].option;
            const itemCount = order.products.length;
            const totalPrice = order.totalPriceEl;
            const orderStatus = order.status;

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
            } else if (orderStatus === '주문 취소') {
                const countElement = document.getElementById('canceled-count');
                if (countElement) {
                    countElement.textContent++;
                }
            }

            // 리스트 불러오기

            myOrderList.insertAdjacentHTML(
                'beforeend',
                `
            <tbody>
                <tr>
                    <td class="order-number" rowspan="1">${orderNumber}</td>
                    <td class="order-date">${orderDate}</td>
                    <td class="order-item">
                       <div>
                        <p class="item-name">${itemName}</p>
                        <p class="option">${option} 외 ${itemCount - 1}건</p>
                       </div>
                       <button class="update-button" id="${orderId}" ${
                    orderStatus === '결제 완료' || orderStatus === '상품준비중' ? '' : 'disabled'
                }>수정</button>
                    </td>
                    <td class="item-count">${itemCount}</td>
                    <td class="price">${totalPrice.toLocaleString()}원</td>
                    <td class="order-status">
                        <span>${orderStatus}</span>
                    </td>
                    <td><button id ="${orderId}" class="cancel-button"  ${
                    orderStatus === '주문 취소' ? 'disabled' : ''
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

        // 주문 수정
        const modifyBtns = document.querySelectorAll('.update-button');
        const orderNumberInput = document.querySelector('#orderNumber');
        const orderProductsInput = document.querySelector('#orderProducts');
        const orderPersonNameInput = document.querySelector('#orderName');
        const orderPhoneNumberInput = document.querySelector('#orderHp');
        const orderAddressInput = document.querySelector('#address');
        const orderDetailAddressInput = document.querySelector('#detailedAddress');
        const orderMessageInput = document.querySelector('#contact');

        modifyBtns.forEach((modifyBtn) => {
            modifyBtn.addEventListener('click', async (e) => {
                openModal();
                const orderId = e.target.id;
                console.log(orderId);

                try {
                    const token = localStorage.getItem('token');
                    const res = await fetch(`https://coffee-learn.mooo.com/api/mypage/orders`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (!res.ok) {
                        throw new Error('에러가 발생했습니다.');
                    }
                    const data = await res.json();
                    const orderInfo = data.filter((item) => {
                        return item._id === orderId;
                    })[0];

                    orderNumberInput.value = orderInfo._id;
                    orderProductsInput.value = orderInfo.products[0].productName;
                    orderPersonNameInput.value = orderInfo.userName;
                    orderPhoneNumberInput.value = orderInfo.receiverPhone;
                    orderAddressInput.value = orderInfo.address;
                    orderDetailAddressInput.value = orderInfo.detailedAddress;
                    orderMessageInput.value = orderInfo.receiverMessage;
                } catch (error) {
                    console.log(error);
                }
            });
        });
    } catch (error) {
        console.log(error);
    }
}
