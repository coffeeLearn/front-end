const userList = document.querySelector('#adminList');

insertUserElement();

async function insertUserElement() {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch('http://kdt-sw-5-team07.elicecoding.com:3000/admin/user', {
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
            const userEmail = user.reg_date;
            const userStatus = user.status;
            const user = user.userId;

            //리스트 불러오기

            userList.insertAdjacentHTML(
                'beforeend',
                `
                <tbody>
                <tr>
                <td class="user-number">${userNumber}</td>
                <td class="user">${user}</td>
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
