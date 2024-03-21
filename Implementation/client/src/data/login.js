import axios from 'axios'

export async function login(email) {
    const resp = await axios.post(
        `http://localhost:3000/api/login`,
        { email },
        {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        }
    )
    return resp
}

export async function loggedInCheck(stopRedirect) {
    try {
        console.log('here')
        const resp = await axios.get(`http://localhost:3000/api/login-check`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '1',
            },
        })
        console.log('here')
        console.log(resp)
        if (resp.status === 200 && !stopRedirect) {
            window.location.replace('/hwcharging/chargers')
        }
    } catch (err) {
        if (err.response && err.response.status === 403) {
            return true
        }
        return
    }
}
