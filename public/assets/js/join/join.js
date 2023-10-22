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
                phone: phoneNumber,
                name,
                addr: address,
                detailAddr: detailedAddress,
            }),
        });

        if (response.status === 200) {
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
