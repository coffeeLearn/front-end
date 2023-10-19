const userEmail = document.querySelector('.user-email');
const userName = document.querySelector('.user-name');
const userPhoneNumber = document.querySelector('.user-phone');
const userAddress = document.querySelector('.user-addr');

handleUserInfo();

async function handleUserInfo() {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch('http://coffee-learn.mooo.com/api/users/mypage', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
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
        userEuserAddressail.value = userInfo.addr;
    } catch (error) {
        alert('에러가 발생했습니다.');
    }
}
