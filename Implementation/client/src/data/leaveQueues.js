import axios from 'axios'
import { backendURL } from '../Env'

async function postRequest(route, body) {
    const resp = await axios.post(`${backendURL}/api/${route}`, body, {
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
