import { Marker } from 'react-leaflet'
import { Icon } from 'leaflet'
import available from '../public/Available.png'
import busy from '../public/Busy.png'
import broken from '../public/Broken.png'

export default function LocationMarker({ location, setLocation }) {
    let icon
    const availableCount = location.availability.available
    const allBroken =
        location.availability.numChargers === location.availability.broken
    if (availableCount > 0) {
        icon = available
    } else if (allBroken) {
        icon = broken
    } else {
        icon = busy
    }
    return (
        <Marker
            position={[location.lat, location.lng]}
            icon={
                new Icon({
                    iconUrl: icon,
                    iconSize: [50, 50],
                    iconAnchor: [12, 41],
                })
            }
            eventHandlers={{
                click: (e) => setLocation(location),
            }}
        />
    )
}
