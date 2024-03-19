import MainBody from '../components/MainBody'
import Navbar from '../components/Navbar'
import { useState, useEffect } from 'react'
import { findManyChargeLocations } from '../dummyData/BackendData'
import Spinner from '../components/Spinner'
import getApiData from '../data/getApiData'
import ChargerCard from '../components/ChargerCard'

export default function Chargers() {
    const [chargeLocations, setChargeLocations] = useState(null)

    useEffect(() => {
        //TODO: Replace with API call to get charge locations - could be done on time interval?
        /* const chargeLocationDummy = findManyChargeLocations

        setTimeout(function () {
            setChargeLocations(chargeLocationDummy)
        }, 1000)*/

        async function getChargers() {
            let data = await getApiData('chargers')
            if (!data) {
                data = { chargers: findManyChargeLocations }
            }
            const { chargers } = data
            if (chargers) {
                setChargeLocations(chargers)
            }
        }
        getChargers()
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
                            return (
                                <ChargerCard
                                    location={location}
                                    key={location.locationID + 'Card'}
                                />
                            )
                        })}
                </div>
            </MainBody>
        </div>
    )
}
