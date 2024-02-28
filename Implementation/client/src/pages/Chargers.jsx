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
        }, 2000)
    }, [])

    return (
        <div className="w-full flex">
            <Navbar active={'Chargers'} type="client" />
            <MainBody>
                <h1 className="font-bold text-3xl p-2 w-full">Chargers</h1>
                <Spinner enabled={!chargeLocations} />
                <div className="w-full grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 pt-8">
                    {chargeLocations &&
                        chargeLocations.map((location) => (
                            <Card
                                className="w-full rounded-md h-32"
                                key={location.id}
                            >
                                {location.name}
                            </Card>
                        ))}
                </div>
            </MainBody>
        </div>
    )
}
