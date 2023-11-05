const userList = document.querySelector('#adminList');

insertUserElement();

async function insertUserElement() {
    const token = localStorage.getItem('token');
    console.log(token);
    try {
        const res = await fetch('https://coffee-learn.mooo.com/api/users/admin/', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) {
            throw new Error('에러가 발생했습니다.');
        }
        const users = await res.json();
        users.reverse();

        users.forEach((user, idx) => {
            const userNumber = users.length - idx;
            const userName = user.name;
            const userEmail = user.email;
            const userStatus = user.authority ? '관리자' : '회원';

            //리스트 불러오기

            userList.insertAdjacentHTML(
                'beforeend',
                `
                <tbody>
                <tr>
                <td class="user-number">${userNumber}</td>
                <td class="user-name">${userName}</td>
                <td class="user-email">${userEmail}</td>
                <td class="user-status">${userStatus}</td>
                </tr>
            </tbody>
        `
            );
        });
    } catch (error) {
        console.error(error);
        alert('에러가 발생했습니다.');
    }
}
