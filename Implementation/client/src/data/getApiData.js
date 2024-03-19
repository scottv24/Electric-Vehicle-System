import axios from 'axios'

export default async function getApiData(route) {
    console.log(
        `${window.location.origin.toString()}/hwcharging/api/${route}/get-data`
    )
    try {
        //`${window.location.origin.toString()}/hwcharging/api/${route}/get-data`
        const url = `http://localhost:3000/api/${route}/get-data`
        const resp = await axios.get(
            //`http://localhost:3000/api/${route}/get-data`,
            url,
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
