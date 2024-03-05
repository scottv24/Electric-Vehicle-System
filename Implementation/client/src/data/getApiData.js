import axios from 'axios'

export default async function getApiData(route) {
    const resp = await axios.get(
        `http://localhost:3000/api/${route}/get-data`,
        {
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        }
    )
    const data = resp.data
    return data
}
