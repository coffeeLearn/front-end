let orderList;
const apiUrl = 'https://coffee-learn.mooo.com/api/mypage/order';
function getProducts() {
    return fetch('/assets/data/order.json')
        .then((response) => {
            if (!response.ok) {
                throw new Error(`${response.status} 에러가 발생했습니다.`);
            }
            return response.json();
        })
        .then((data) => {
            orderList = data;
            console.log(orderList);
        })
        .catch((error) => {
            console.error('Error fetching product data:', error);
        });
}

// async 함수를 정의하여 비동기적으로 실행합니다.
async function initialize() {
    try {
        await getProducts(); // getProducts() 함수를 await하여 데이터를 가져옵니다.
        // 데이터가 할당된 후에 원하는 작업을 수행합니다.
        console.log('Products data has been initialized.');
        //새로고침 시 7일 자동클릭
        clickSearchBtn();
    } catch (error) {
        console.error('Error initializing products data:', error);
    }
}

function clickSearchBtn() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const orders = getOrdersByDateRange(startDate, endDate);
    //기간에 맞는 order 배열
    displayOrders(orders);
} //조회 날짜별 검색

function getOrdersByDateRange(startDate, endDate) {
    const filteredOrders = orderList.filter(function (order) {
        return order.orderDate >= startDate && order.orderDate <= endDate && order.id == 'ehdgns@naver.com';
    });

    return filteredOrders;
} // input으로 기간 입력받아서 모든 주문 목록에서 기간에 맞는 필터함수 사용
// 추후 사용자 아이디랑 연동해서 아이디 && 날짜 해야할듯.

function displayOrders(orders) {
    //기간에 맞는 order 배열입력받음
    // orders.reverse();
    const emptyOrder = document.querySelector('.empty-order');
    const cancleBtn = document.createElement('input');
    cancleBtn.type = 'button';
    cancleBtn.className = 'modify-btn';
    cancleBtn.value = '주문 취소';
    const modifyBtn = document.createElement('input');
    modifyBtn.type = 'button';
    modifyBtn.className = 'cancle-btn';
    modifyBtn.value = '주문 수정';

    const orderRows = orders
        .map((order) => {
            const deliveryStatusCell = order.orderStatus === '배송준비중' ? cancleBtn.outerHTML : '-';
            const orderModifyCell = order.orderStatus === '배송준비중' ? modifyBtn.outerHTML : '-';
            let nProduct = order.productInfo.length > 1 ? `..외 ${order.productInfo.length - 1}건` : '';
            //배송준비중 일 때만 취소버튼 생성 취소버튼 구현은 다음에
            return `

      <tr>
        <td><span>${order.orderNumber}</span><p> <span style="color: gray;">${order.orderDate}</span></td>
        <td>${order.productInfo[0].productName}<p><span style="color: gray;">${order.productInfo[0].option}${nProduct}</span></td>
        <td>${order.productInfo[0].amount}</td>
        <td>${order.totalPriceEl}</td>
        <td>${order.orderStatus}</td>
        <td>${deliveryStatusCell}</td>
        <td>${orderModifyCell}</td>
      </tr>
    `; //테이블 양식에 맞춰 넣어주기
        })
        .join('');
    // apend
    if (!orders.length == 0) {
        emptyOrder.classList.add('clicked');
    }
    if (orders.length == 0 && emptyOrder.classList.contains('clicked')) {
        emptyOrder.classList.remove('clicked');
    }
    // 주문 내역 여부에 따라서 class 추가해서 주문 내역이 없습니다 안내 여부 판단
    document.getElementById('order-rows').innerHTML = orderRows;

    // 모달작업!!
    const onOrderModifyModal = document.querySelectorAll('.cancle-btn');
    onOrderModifyModal.forEach((btn) => {
        btn.addEventListener('click', modifyOrderModal);
    });
    // querySelectorAll를 적용하면 forEach를 사용해서 이벤트를 등록해주어야 한다.
    function modifyOrderModal(event) {
        document.getElementById('myModal').style.display = 'block';
        // 모달 기본값 작업
        const orderNumber = document.getElementById('orderNumber');
        const orderProducts = document.getElementById('orderProducts');
        const orderName = document.getElementById('orderName');
        const orderHp = document.getElementById('orderHp');
        const orderAddress = document.getElementById('address');
        const orderDetailedAddress = document.getElementById('detailedAddress');
        const orderContact = document.getElementById('contact');

        const target = event.currentTarget;
        const rowElem = target.closest('tr');
        let orderNumberModifyrow = rowElem.querySelector('td:nth-child(1)');
        let orderNumberModify = orderNumberModifyrow.querySelector('span');
        let orderProductsModify = rowElem.querySelector('td:nth-child(2)');

        orderNumber.innerHTML = orderNumberModify.innerHTML;
        orderProducts.innerHTML = orderProductsModify.innerHTML;

        // 주문 번호를 기준으로 해당 주문 객체를 찾습니다.
        const order = orders.find((o) => o.orderNumber === orderNumberModify.innerHTML);

        // 주문 정보(orderInfo)에서 receiverName과 receiverPhone 값을 가져옵니다.
        const receiverName = order.orderInfo.receiverName;
        const receiverPhone = order.orderInfo.receiverPhone;
        const address = order.orderInfo.address;
        const detailedAddress = order.orderInfo.detailedAddress;
        const receiverMessage = order.orderInfo.receiverMessage;

        // orderName과 orderHp 입력 필드에 값을 할당합니다.
        orderName.value = receiverName;
        orderHp.value = receiverPhone;
        orderAddress.value = address;
        orderDetailedAddress.value = detailedAddress;
        orderContact.value = receiverMessage;

        //수정 버튼 클릭
        const modifyCompleteBtn = document.querySelector('#modifyComplete');
        modifyCompleteBtn.addEventListener('click', () => {
            console.log('click');
        });
    }
    // 주문 내역의 건수를 가져옵니다.
    const totalOrders = `내역 총 ${orders.length}건`;
    // strong 태그에 내역 총 건수를 업데이트합니다.
    totalOrdersCls.innerHTML = totalOrders;
}

//조회 기간 버튼 - 오늘
function dateChangeToday() {
    const today = new Date().toISOString().split('T')[0];
    //Date 쪼개기
    document.getElementById('start-date').value = today;
    document.getElementById('end-date').value = today;
    resetButtonStyles();
    btnToday.style.backgroundColor = '#288341';
    btnToday.style.color = 'white';
}

//조회 기간 버튼 - 7일
function dateChangeWeek() {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6).toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];
    document.getElementById('start-date').value = startDate;
    document.getElementById('end-date').value = endDate;
    resetButtonStyles();
    btnWeek.style.backgroundColor = '#288341';
    btnWeek.style.color = 'white';
}

//조회 기간 버튼 - 1개월
function dateChangeMonth() {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate() + 1)
        .toISOString()
        .split('T')[0];
    const endDate = today.toISOString().split('T')[0];
    document.getElementById('start-date').value = startDate;
    document.getElementById('end-date').value = endDate;
    resetButtonStyles();
    btnMonth.style.backgroundColor = '#288341';
    btnMonth.style.color = 'white';
}

//조회 기간 버튼 - 3개월
function dateChange3Month() {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate() + 1)
        .toISOString()
        .split('T')[0];
    const endDate = today.toISOString().split('T')[0];
    document.getElementById('start-date').value = startDate;
    document.getElementById('end-date').value = endDate;
    resetButtonStyles();
    btn3Month.style.backgroundColor = '#288341';
    btn3Month.style.color = 'white';
}

//조회 기간 버튼 - 1년
function dateChangeYear() {
    const today = new Date();
    const startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate() + 1)
        .toISOString()
        .split('T')[0];
    const endDate = today.toISOString().split('T')[0];
    document.getElementById('start-date').value = startDate;
    document.getElementById('end-date').value = endDate;
    resetButtonStyles();
    btnYear.style.backgroundColor = '#288341';
    btnYear.style.color = 'white';
}
//버튼 클릭시 모든 버튼 배경색 흰색, 글꼴 검정으로 초기화하는 함수
function resetButtonStyles() {
    btnToday.style.backgroundColor = '#fff';
    btnWeek.style.backgroundColor = '#fff';
    btnMonth.style.backgroundColor = '#fff';
    btn3Month.style.backgroundColor = '#fff';
    btnYear.style.backgroundColor = '#fff';
    btnToday.style.color = 'black';
    btnWeek.style.color = 'black';
    btnMonth.style.color = 'black';
    btn3Month.style.color = 'black';
    btnYear.style.color = 'black';
}
const searchBtn = document.getElementById('search-button');
const btnToday = document.getElementById('btnToday');
const btnWeek = document.getElementById('btnWeek');
const btnMonth = document.getElementById('btnMonth');
const btn3Month = document.getElementById('btn3Month');
const btnYear = document.getElementById('btnYear');
const totalOrdersCls = document.querySelector('.total-orders'); //내역 총 n건 사용
searchBtn.addEventListener('click', clickSearchBtn); //조회 버튼 클릭 이벤트 등록
btnToday.addEventListener('click', dateChangeToday); //오늘 버튼 클릭 이벤트 등록
btnWeek.addEventListener('click', dateChangeWeek); //7일 버튼 클릭 이벤트 등록
btnMonth.addEventListener('click', dateChangeMonth); //1개월 버튼 클릭 이벤트 등록
btn3Month.addEventListener('click', dateChange3Month); //3개월 버튼 클릭 이벤트 등록
btnYear.addEventListener('click', dateChangeYear); //1년 버튼 클릭 이벤트 등록

// 엘리먼트리스트 여러엘리먼트 한번에 등록하기

// initialize() 함수를 호출하여 초기화 작업을 시작합니다.
dateChangeWeek();

initialize();
