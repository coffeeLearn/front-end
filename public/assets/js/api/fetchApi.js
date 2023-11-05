function fetchApi(path, params) {
    const token = localStorage.getItem('token');
    const URL = 'https://coffee-learn.mooo.com/api/';
    return fetch(`${URL}${path}`, {
        ...params,
        headers: {
            'Content-Type': 'application/json',
            Authorization: token ?? undefined,
            ...params.headers,
        },
        // body: JSON.stringify(loginData),
    });
}
