import axios from 'axios'

export async function joinQueue(locations) {
    try {
        const resp = await axios.post(
            `${window.location.origin.toString()}/hwcharging/api/queues/join-queue`,
            { locations },
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '1',
                },
            }
        )
        if (resp.data) {
            return resp.data
        }
    } catch (err) {
        if (err.response && err.response.status) {
            return { failure: true }
        }
        return {}
    }
}

export async function checkIn(chargingPointID) {
    try {
        await axios.patch(
            `${window.location.origin.toString()}/hwcharging/api/queues/check-in`,
            { chargingPointID },
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '1',
                },
            }
        )
        return true
    } catch (err) {
        return false
    }
}

export async function checkOut() {
    try {
        await axios.patch(
            `${window.location.origin.toString()}/hwcharging/api/queues/check-out`,
            {},
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '1',
                },
            }
        )
        return true
    } catch (err) {
        return false
    }
}

export async function cancelReservation() {
    try {
        await axios.patch(
            `${window.location.origin.toString()}/hwcharging/api/queues/cancel-reservation`,
            {},
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '1',
                },
            }
        )
        return true
    } catch (err) {
        return false
    }
}
