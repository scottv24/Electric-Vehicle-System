import axios from 'axios'
import { backendURL } from '../Env'

export default async function updateCharger(chargingPointID, status, message) {
    try {
        await axios.patch(
            `${backendURL}/api/chargers/update-charger`,
            { chargingPointID, status, message },
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
