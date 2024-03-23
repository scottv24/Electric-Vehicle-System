import axios from 'axios'
import { backendURL } from '../Env'

export async function updateReport({ reportID, chargingPointID }) {
    let path
    if (reportID) {
        path = 'remove-report'
    } else if (chargingPointID) {
        path = 'validate-broken'
    } else {
        return false
    }
    try {
        await axios.patch(
            `${backendURL}/api/admin/${path}`,
            { chargingPointID, reportID },
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '1',
                },
            }
        )
        return window.location.reload()
    } catch (err) {
        return false
    }
}
