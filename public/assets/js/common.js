const auth_btn = document.querySelector('.auth-btn'); // a tag
const btn_txt = document.querySelector('.btn-login-txt'); // 로그인,로그아웃 텍스트 영역
const isLoggedIn = localStorage.getItem('token') !== null; // 토큰이 있으면

// 비로그인시 마이페이지 접근 못하게 방지
const toMypageBtn = document.querySelector('.mypage-btn');
toMypageBtn.onclick = () => {
    if (isLoggedIn) {
        location.href = '/mypage';
    } else {
        alert('로그인이 필요합니다.');
        location.href = '/login';
    }
};

// 로그인, 로그아웃 텍스트 및 링크 전환
function checkLoginStatus() {
    if (isLoggedIn) {
        btn_txt.textContent = '로그아웃'; // 로그아웃으로 텍스트 변경
        auth_btn.onclick = () => {
            // a 태그 전체 클릭하면
            if (confirm('로그아웃 하시겠습니까?')) {
                localStorage.removeItem('token'); // 토큰 제거 -> 로그아웃
                alert('로그아웃이 되었습니다.'); // 알림
                location.href = '/'; // 홈으로 이동
            } else {
                // 취소를 눌렀을 때에는 경로이동하지 않음
                return false;
            }
        };
    } else {
        btn_txt.textContent = '로그인';
        auth_btn.onclick = () => {
            // a 태그 전체 클릭하면
            location.href = '/login';
        };
    }
}

window.addEventListener('load', () => {
    checkLoginStatus();
});

// 기능 준비중 메세지 alert
function upComingFeatureAlert() {
    alert('☕ 준비중인 기능입니다.');
}
