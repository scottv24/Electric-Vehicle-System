import axios from 'axios'

export default async function getApiData(route) {
    console.log(
        `${window.location.origin.toString()}/hwcharging/api/${route}/get-data`
    )
    try {
        const resp = await axios.get(
            //`http://localhost:3000/api/${route}/get-data`,
            `${window.location.origin.toString()}/hwcharging/api/${route}/get-data`,
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            }
        )

        const data = resp.data
        return data
    } catch (e) {
        return null
    }
}
