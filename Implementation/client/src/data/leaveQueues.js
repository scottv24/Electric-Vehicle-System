import axios from 'axios'

async function postRequest(route, body) {
    const resp = await axios.post(`http://localhost:3000/api/${route}`, body, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
    })

    const data = resp.data
    return data
}

export default async function leaveQueue(locationsArray, userID) {
    if (!userID) {
        userID = 1
    }
    const route = 'queues/leave-queue'
    const locations = JSON.stringify(locationsArray)
    const body = { locations, userID }
    await postRequest(route, body)
}
