import axios from 'axios'

async function postRequest(route, body) {
    const resp = await axios.post(`${window.location.origin.toString()}/hwcharging/api/${route}`, body, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        },
    })

    const data = resp.data
    return data
}

export default async function leaveQueue(locationsArray) {
    const route = 'queues/leave-queue'
    const locations = JSON.stringify(locationsArray)
    const body = { locations }
    await postRequest(route, body)
}
