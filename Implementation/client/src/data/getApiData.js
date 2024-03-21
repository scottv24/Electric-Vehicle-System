import axios from 'axios'

export default async function getApiData(route) {
    try {
        //`${window.location.origin.toString()}/hwcharging/api/${route}/get-data`
        const url = `http://localhost:3000/api/${route}/get-data`
        const resp = await axios.get(
            //`http://localhost:3000/api/${route}/get-data`,
            url,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '1',
                },
            }
        )
        const data = resp.data
        return data
    } catch (err) {
        if (err.response && err.response.status === 403) {
            window.location.replace('/hwcharging')
        }
        return {}
    }
}
