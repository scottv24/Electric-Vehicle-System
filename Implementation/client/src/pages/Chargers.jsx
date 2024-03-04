import MainBody from '../components/MainBody'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import { useState, useEffect } from 'react'
import { findManyChargeLocations } from '../dummyData/BackendData'
import Spinner from '../components/Spinner'

export default function Chargers() {
    const [chargeLocations, setChargeLocations] = useState(null)

    useEffect(() => {
        //TODO: Replace with API call to get charge locations - could be done on time interval?
        const chargeLocationDummy = findManyChargeLocations

        setTimeout(function () {
            setChargeLocations(chargeLocationDummy)
        }, 1000)
    }, [])

    return (
        <div className="w-full flex">
            <Navbar active={'Chargers'} type="client" />
            <MainBody>
                <h1 className="font-bold text-3xl p-2 w-full">Chargers</h1>
                <Spinner enabled={!chargeLocations} />
                <div className="w-full grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 pt-8">
                    {chargeLocations &&
                        chargeLocations.map((location) => {
                            const chargers = location.chargePoint
                            const available = chargers.filter(
                                (charger) => charger.status === 'FREE'
                            )
                            return (
                                <Card
                                    className="w-full rounded-md h-32 hover:cursor-pointer"
                                    key={location.id}
                                >
                                    <div className="flex justify-between">
                                        <div className="w-3/4">
                                            <h2 className="font-semibold text-lg">
                                                {location.name}
                                            </h2>

                                            <p className="text-gray">{`${location.chargeSpeed}kWh`}</p>
                                            <p
                                                className={`lg:hidden block ${
                                                    available.length
                                                        ? 'text-accent'
                                                        : 'text-red'
                                                }`}
                                            >
                                                {available.length}/
                                                {chargers.length} Available
                                            </p>
                                        </div>
                                        <div
                                            className={`lg:block text-center hidden ${
                                                available.length
                                                    ? 'bg-accent border-accent'
                                                    : 'bg-red border-red'
                                            } border-2 bg-opacity-40 rounded-full p-2  aspect-square w-1/4 `}
                                        >
                                            {available.length}/{chargers.length}{' '}
                                            Available
                                        </div>
                                    </div>
                                </Card>
                            )
                        })}
                </div>
            </MainBody>
        </div>
    )
}
