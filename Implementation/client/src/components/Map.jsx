import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
} from 'react-leaflet'

import { Helmet } from 'react-helmet'

import Leaflet from 'leaflet'
import LocationMarker from './LocationMarker'

export default function Map({ chargeLocations, setLocation }) {
    return (
        <>
            <Helmet>
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                    crossorigin=""
                />
                <script
                    src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
                    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
                    crossorigin=""
                ></script>
            </Helmet>
            <div className="h-full w-full">
                <MapContainer
                    touchZoom={true}
                    minZoom={16}
                    center={[55.91064861658617, -3.319598154925528]}
                    zoom={16}
                    scrollWheelZoom={true}
                    className="h-full"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {chargeLocations &&
                        chargeLocations.map((location) => {
                            return (
                                <LocationMarker
                                    location={location}
                                    setLocation={setLocation}
                                />
                            )
                        })}
                    <ClearLocation clear={() => setLocation(null)} />
                </MapContainer>
            </div>
        </>
    )
}

function ClearLocation({ clear }) {
    const map = useMapEvents({
        click: () => {
            clear()
        },
    })
    return null
}
