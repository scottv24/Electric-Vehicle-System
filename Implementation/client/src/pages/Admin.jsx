import MainBody from '../components/MainBody'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'
import { findManyChargeLocations } from '../dummyData/BackendData'
import Spinner from '../components/Spinner'

export default function Admin() {
    const [chargeLocations, setChargeLocations] = useState(null)

    useEffect(() => {
        //TODO: Replace with API call to get charge locations - could be done on time interval?
        const chargeLocationDummy = findManyChargeLocations

        setTimeout(function () {
            setChargeLocations(chargeLocationDummy)
        }, 1000)
    }, [])

    console.log('test')
    return (
        <div className="w-full flex bg-bg">
            <Navbar active={'Chargers'} type="admin" />
            <MainBody>
                <Spinner enabled={!chargeLocations} />
                {chargeLocations && (
                    <Card className="min-h-[400px] p-0 grid grid-cols-4 grid-rows-10 sm:w-full w-full sm:h-full sm:h-auto">
                        <button class="col-span-2 row-start-1 row-end-2">
                            Table View
                        </button>
                        <button class="col-span-2 bg-bg2 text-lg hover:bg-white hover:border-2 hover: border-black">
                            Map View
                        </button>
                        <h1 class=" col-span-3 row-start-2 text-center text-3xl font-bold">
                            Charging Locations
                        </h1>
                        <button class=" hover: border-black col-start-4 bg-accent py-2 text-white text-bold rounded-l rounded-r align-right">
                            Edit
                            <FontAwesomeIcon icon={faPen} className="ml-2" />
                        </button>

                        <table class="divide-y divide-solid table-auto col-span-full row-start-4">
                            <thead>
                                <tr>
                                    <th class="text-left px-4 py-2">
                                        Location
                                    </th>
                                    <th class="px-4 py-2">No. Chargers</th>
                                    <th class="px-4 py-2">Available</th>
                                    <th class="px-4 py-2">In Queue</th>
                                    <th class="px-4 py-2">Broken</th>
                                    <th class="px-4 py-2">Wattage</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-solid">
                                {chargeLocations.map((location) => (
                                    <Locations location={location} />
                                ))}
                            </tbody>
                        </table>
                    </Card>
                )}
            </MainBody>
        </div>
    )
}
function Locations({ location }) {
    const { name, chargingPoint, queue, wattage } = location
    const numChargers = chargingPoint.length
    const available = chargingPoint.filter(
        (charger) => charger.status === 'FREE'
    )
    const broken = chargingPoint.filter(
        (charger) => charger.status === 'BROKEN'
    )
    return (
        <tr class="divide-y divide-solid bg-bg2">
            <td>{name}</td>
            <td>{numChargers}</td>
            <td>{available.length}</td>
            <td>{queue.length}</td>
            <td>{broken.length}</td>
            <td>{wattage}kWh</td>
        </tr>
    )
}
