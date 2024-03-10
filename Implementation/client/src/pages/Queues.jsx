import MainBody from '../components/MainBody'
import Navbar from '../components/Navbar'
import { useState, useEffect } from 'react'
import Spinner from '../components/Spinner'
import getApiData from '../data/getApiData'
import LocationCard from '../components/ChargerCard'
import numericalSuffix from '../data/numericSuffix'

export default function Queues() {
    const [queues, setQueues] = useState(null)

    useEffect(() => {
        //TODO: Replace with API call to get charge locations - could be done on time interval?
        /* const chargeLocationDummy = findManyChargeLocations

        setTimeout(function () {
            setChargeLocations(chargeLocationDummy)
        }, 1000)*/

        async function getQueues() {
            const { queues } = await getApiData('queues')
            if (queues) {
                console.log(queues)
                setQueues(queues)
            }
        }
        getQueues()
    }, [])

    return (
        <div className="w-full flex">
            <Navbar active={'Queues'} type="client" />
            <MainBody>
                <h1 className="font-bold text-3xl p-2 w-full">Queues</h1>
                <Spinner enabled={!queues} />
                {queues && (
                    <div className="mx-auto w-3/4 flex flex-col items-center gap-3">
                        <div className="text-accent font-semibold text-center text-lg py-8">
                            <p>Your Closest Position Is</p>
                            <p className="text-2xl font-extrabold">
                                {numericalSuffix(queues[0].position)}
                            </p>
                            <p className="text-black">
                                At the National Robotarium
                            </p>
                        </div>
                        {queues.map((location) => {
                            return (
                                <LocationCard
                                    location={location}
                                    queue={true}
                                    key={location.locationID + 'Card'}
                                />
                            )
                        })}
                    </div>
                )}
            </MainBody>
        </div>
    )
}
