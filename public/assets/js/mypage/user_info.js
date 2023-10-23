const userEmail = document.querySelector('.user-email');
const userPassword = document.querySelector('.user-password');
const userName = document.querySelector('.user-name');
const userPhoneNumber = document.querySelector('.user-phone');
const userAddress = document.querySelector('.user-address');
const userDetailAddress = document.querySelector('.user-detail-address');
const updateBtn = document.querySelector('.edit-btn');
const token = localStorage.getItem('token');

// 회원정보 불러오기

handleUserInfo();

async function handleUserInfo() {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch('http://coffee-learn.mooo.com/api/users/mypage', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (!res.ok) {
            throw new Error('에러가 발생했습니다.');
        }
        const userInfo = await res.json();

        // 유저 정보 불러오기

        userEmail.value = userInfo.email;
        userName.value = userInfo.name;
        userPhoneNumber.value = userInfo.phone;
        userAddress.value = userInfo.address;
        userDetailAddress.value = userInfo.detailedAddress;
    } catch (error) {
        alert('에러가 발생했습니다.');
    }
}
// 회원정보 수정

updateBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const name = userName.value;
    const phone = userPhoneNumber.value;
    const email = userEmail.value;
    const address = userAddress.value;
    const detailedAddress = userDetailAddress.value;
    const password = userPassword.value;

    const newUserInfo = JSON.stringify({
        name,
        email,
        password,
        phone,
        address,
        detailedAddress,
    });

    try {
        const res = await fetch('http://coffee-learn.mooo.com/api/users/mypage', {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: newUserInfo,
        });
        if (res.ok) {
            alert('정보가 수정되었습니다.');
        }
    } catch (error) {
        alert('정보 수정이 실패하였습니다.');
    }
});
