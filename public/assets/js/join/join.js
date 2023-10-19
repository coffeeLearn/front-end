// 회원가입(fetch) 함수
async function signUp() {
    const id = document.getElementById('id').value;
    const pw = document.getElementById('pw').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const detailedAddress = document.getElementById('detailedAddress').value;

    try {
        const response = await fetch('http://coffee-learn.mooo.com/api/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: id,
                password: pw,
                phone_number: phoneNumber,
                name,
                address,
                detailed_address: detailedAddress,
            }),
        });

        if (response.status === 201) {
            window.location.href = '/join/finish';
        } else {
            const errorData = await response.json();
            alert(`회원가입 실패: ${errorData.message}` || 'ERROR');
        }
    } catch (error) {
        alert(`네트워크 오류! 다시 시도해주십시오. 에러: ${error.message}`);
    }
}

// 버튼 클릭 시 회원가입 실행
const signUpButton = document.querySelector('.btn-area .btn1');
signUpButton.addEventListener('click', signUp);

// // 이거로 로컬에 회원가입정보 들어가는건 확인함
// submitBtn.addEventListener('click', function () {
//     const req = {
//         email: userId.value,
//         password: userPw.value,
//         // passwordCheck: userPwCheck.value, 필요없으면 빼기
//         name: userName.value,
//         phone: userPhone_number.value,
//         addr: userAddress.value + ' ' + userdetailedAddress.value,
//     };
//     console.log(req);
//     localStorage.setItem('userId', JSON.stringify(req));
//     location.href = 'finish_signup';
// });
