// 모달 열기
function openModal() {
    document.getElementById('myModal').style.display = 'block';
}

// 모달 닫기
function closeModal() {
    document.getElementById('myModal').style.display = 'none';
}

// // 주문 수정
// const modifyBtns = document.querySelectorAll('.update-button');
// const orderInfoModal = document.querySelector('#myModal');
// const orderNumberInput = document.querySelector('#orderNumber');
// const orderProductsInput = document.querySelector('#orderProducts');
// const orderPersonNameInput = document.querySelector('#orderName');
// const orderPhoneNumberInput = document.querySelector('#orderHp');
// const orderAddressInput = document.querySelector('#address');
// const orderDetailAddressInput = document.querySelector('#detailedAddress');
// const orderMessageInput = document.querySelector('#contact');

// modifyBtns.forEach((modifyBtn) => {
//     modifyBtn.addEventListener('click', (e) => {
//         openModal();
//         const orderId = e.target.Id;
//         orderDetails(orderId);
//     });
// });

// async function orderDetails(orderId) {
//     try {
//         const token = localStorage.getItem('token');
//         const res = await fetch(`https://coffee-learn.mooo.com/api/mypage/orders/${orderId}`, {
//             method: 'GET',
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         if (!res.ok) {
//             throw new Error('에러가 발생했습니다.');
//         }
//         const order = await res.json();

//         orderNumberInput.value = order._id;
//         orderProductsInput.value = order.products[0].productName;
//         orderPersonNameInput.value = order.userName;
//         orderPhoneNumberInput.value = order.receiverPhone;
//         orderAddressInput.value = order.address;
//         orderDetailAddressInput.value = order.detailedAddress;
//         orderMessageInput.value = order.receiverMessage;
//     } catch (error) {
//         console.log(error);
//     }
// }
