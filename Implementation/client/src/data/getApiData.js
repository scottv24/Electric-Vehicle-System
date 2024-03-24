import axios from 'axios'
import { backendURL } from '../Env'

export default async function getApiData(route) {
    try {
        const url = `${backendURL}/api/${route}/`
        const resp = await axios.get(
            url,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '1',
                },
            }
        )
        console.log(resp)
        const data = resp.data
        return data
    } catch (err) {
        console.log(err.repsonse)
        if (err.response && err.response.status === 403) {
            window.location.replace('/hwcharging')
        }
        return {}
    }
}
