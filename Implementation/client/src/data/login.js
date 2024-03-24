import axios from 'axios'
import { frontendURL, backendURL } from '../Env'

export async function login(email, location) {
    const resp = await axios.post(
        `${backendURL}/api/login`,
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
        const resp = await axios.get(`${backendURL}/api/login-check`, {
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

export async function adminCheck(stopRedirect) {
    try {
        const resp = await axios.get(`${backendURL}/api/admin-check`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '1',
            },
        })
        console.log(resp)
        if (resp.status === 200 && !stopRedirect) {
            return true
        }
    } catch (err) {
        if (err.response && err.response.status === 403) {
            return false
        }
        return
    }
}

export async function logout() {
    try {
        await axios.patch(
            `${backendURL}/api/account/logout`,
            {},
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '1',
                },
            }
        )
        window.location.replace(frontendURL)
        return
    } catch (err) {
        return false
    }
}

export async function deleteAccount() {
    try {
        await axios.patch(
            `${backendURL}/api/account/delete-account`,
            {},
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '1',
                },
            }
        )
        window.location.replace(frontendURL)
    } catch (err) {
        return false
    }
}
