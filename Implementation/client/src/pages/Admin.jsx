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
                    <Card className="min-h-[400px] sm:w-full w-full sm:h-full sm:h-auto">
                        <div className="w-full h-1/6 flex justify-stretch">
                            <button className="w-1/2">Table View</button>
                            <button className="w-1/2 bg-bg2 text-lg hover:bg-white hover:border-2 hover: border-black">
                                Map View
                            </button>
                        </div>
                        <div className="p-4 grid grid-cols-4  gap-20">
                            <h1 className=" col-span-3 row-start-1 text-3xl font-bold flex justify-left items-center">
                                Charging Locations
                            </h1>
                            <div className=" w-full  col-start-4 flex items-center">
                                <button className="w-full hover: border-black bg-accent py-2 text-white text-bold rounded-l rounded-r align-right">
                                    Edit
                                    <FontAwesomeIcon
                                        icon={faPen}
                                        className="ml-2"
                                    />
                                </button>
                            </div>

                            <table className="divide-y divide-solid table-auto col-span-full">
                                <thead>
                                    <tr>
                                        <th className="text-left px-4 py-2">
                                            Location
                                        </th>
                                        <th className="px-4 py-2">
                                            No. Chargers
                                        </th>
                                        <th className="px-4 py-2 md:table-cell hidden">
                                            Available
                                        </th>
                                        <th className="px-4 py-2 md:table-cell hidden">
                                            In Queue
                                        </th>
                                        <th className="px-4 py-2 md:table-cell hidden">
                                            Broken
                                        </th>
                                        <th className="px-4 py-2 md:table-cell hidden">
                                            Wattage
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-solid">
                                    {chargeLocations.map((location) => (
                                        <Locations location={location} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
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
        <tr className="divide-solid bg-bg2 p-4">
            <td className="p-10">{name}</td>
            <td>{numChargers}</td>
            <td className="md:table-cell hidden">{available.length}</td>
            <td className="md:table-cell hidden">{queue.length}</td>
            <td className="md:table-cell hidden">{broken.length}</td>
            <td className="md:table-cell hidden">{wattage}kWh</td>
        </tr>
    )
}
