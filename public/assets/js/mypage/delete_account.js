//회원 탈퇴 하기

const unsubscribBtn = document.querySelector('.unsubscrib');

unsubscribBtn.addEventListener('click', async () => {
    const token = localStorage.getItem('token');

    if (window.confirm('회원 탈퇴를 진행하시겠습니까?')) {
        try {
            await fetch('http://coffee-learn.mooo.com/api/users/mypage', {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            alert('회원탈퇴가 완료되었습니다.');
            window.location.href = '/';
            localStorage.removeItem('token');
        } catch (error) {
            alert('회원탈퇴에 실패했습니다. 관리자에게 문의하세요.');
        }
    }
});
