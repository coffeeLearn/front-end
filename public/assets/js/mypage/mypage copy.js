const myOrderList = document.querySelector('#maypageList');

getProducts();
async function getProducts() {
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
        console.log(orders);

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
            myOrderList.insertAdjacentHTML(
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
                            ${orderStatus}
                        </select>
                        <button class="update-button" data-order-id="${orderId}">수정</button>
                    </td>
                    <td><button id ="${orderId}" class="cancel-button">주문 취소</button></td>
                </tr>
            </tbody>
        `
            );
        });
    } catch (error) {
        console.log(error);
    }
}
