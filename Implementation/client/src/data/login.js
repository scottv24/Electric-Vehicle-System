import axios from 'axios'

export async function login(email, location) {
    const resp = await axios.post(
        `${window.location.origin.toString()}/hwcharging/api/login`,
        { email, location },
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
        const resp = await axios.get(`${window.location.origin.toString()}/hwcharging/api/login-check`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '1',
            },
        })
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
