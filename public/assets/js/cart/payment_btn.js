// 결제하기 버튼 클릭 시 처리
const paymentButton = document.querySelector('.btn-payment-final');
const orderName = document.querySelector('#receiverName');
const orderPhone = document.querySelector('#receiverPhone');
const orderAddress = document.querySelector('#address');
const orderDetailedAddress = document.querySelector('#detailedAddress');
const orderMessage = document.querySelector('#receiverMessage');
const totalPrices = document.querySelector('#totalOrderPrice').innerHTML;
const orderTotalPrice = parseInt(totalPrices.replace(',', ''));

const cartItems = localStorage.getItem('cartItems');
const cartArray = JSON.parse(cartItems);

paymentButton.addEventListener('click', async function () {
    const products = cartArray;
    const receiver = orderName.value;
    const receiverPhone = orderPhone.value;
    const address = orderAddress.value;
    const detailedAddress = orderDetailedAddress.value;
    const receiverMessage = orderMessage.value;

    const orders = JSON.stringify({
        products,
        receiver,
        receiverPhone,
        address,
        detailedAddress,
        receiverMessage,
        totalPriceEl: orderTotalPrice,
    });
    try {
        const token = localStorage.getItem('token');

        const res = await fetch('http://coffee-learn.mooo.com/api/users/orders', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: orders,
        });
        console.log(res);
    } catch (error) {
        console.log(error);
    }

    //  결제 완료 후 처리할 코드 작성: 로컬스토리지 초기화, 페이지 이동
    localStorage.removeItem('cartItems');
    localStorage.removeItem('paymentItems');
    localStorage.removeItem('orderInfo');
    window.location.href = '/cart/order_complete';
});
