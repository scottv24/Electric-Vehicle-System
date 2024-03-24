import MainBody from '../components/MainBody'
import Navbar from '../components/Navbar'
import { useState, useEffect } from 'react'
import { findManyChargeLocations } from '../dummyData/BackendData'
import Spinner from '../components/Spinner'
import getApiData from '../data/getApiData'
import ChargerCard from '../components/ChargerCard'
import Button from '../components/Button'
import Map from '../components/Map'
import LocationInfo from '../components/LocationInfo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import Card from '../components/Card'
import ChargerLocationFlow from '../components/ChargerLocationFlow'

export default function Chargers() {
    const [chargeLocations, setChargeLocations] = useState(null)
    const [mapView, setMapView] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState(false)
    useEffect(() => {
        //TODO: Replace with API call to get charge locations - could be done on time interval?
        /* const chargeLocationDummy = findManyChargeLocations

        setTimeout(function () {
            setChargeLocations(chargeLocationDummy)
        }, 1000)*/

        async function getChargers() {
            console.log('Getting chargers')
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
        <div className="w-full flex h-screen">
            <Navbar active={'Chargers'} type="client" />
            <MainBody>
                <div className="flex">
                    <h1 className="font-bold text-3xl p-2 w-full">Chargers</h1>
                    <Button
                        color="GREEN"
                        onClick={() => {
                            setMapView(!mapView)
                            setSelectedLocation(null)
                        }}
                    >
                        {mapView ? 'Dashboard' : 'Map'} View
                    </Button>
                </div>
                <Spinner enabled={!chargeLocations} />

                {!mapView && (
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
                )}
                {mapView && chargeLocations && (
                    <Card className="w-full h-full p-8 overflow-hidden justify-center items-center align-middle sm:flex hidden">
                        <Map
                            chargeLocations={chargeLocations}
                            setLocation={setSelectedLocation}
                        />

                        <div
                            className={`h-full p-4 ${
                                selectedLocation ? 'w-1/3' : ' w-0'
                            } transition-all ease-in-out duration-400 `}
                        >
                            {selectedLocation && (
                                <div className="flex flex-col">
                                    <button
                                        className="self-end"
                                        onClick={() =>
                                            setSelectedLocation(null)
                                        }
                                    >
                                        <FontAwesomeIcon icon={faXmark} />
                                    </button>
                                    <ChargerLocationFlow
                                        location={selectedLocation}
                                        setOpen={setSelectedLocation}
                                    />
                                </div>
                            )}
                        </div>
                    </Card>
                )}
                {mapView && chargeLocations && (
                    <div className="w-full h-[85vh] justify-start items-center align-middle flex flex-col sm:hidden mt-2">
                        <div
                            className={`${
                                selectedLocation ? 'h-1/5' : ' h-full'
                            } h-full w-full`}
                        >
                            <Map
                                chargeLocations={chargeLocations}
                                setLocation={(location) => {
                                    setSelectedLocation(location)
                                    console.log(location)
                                }}
                            />
                        </div>
                        <div
                            className={`w-full p-4 ${
                                selectedLocation ? 'h-4/5' : ' h-0'
                            } transition-all ease-in-out duration-400 `}
                        >
                            {selectedLocation && (
                                <div className="flex flex-col">
                                    <button
                                        className="self-end"
                                        onClick={() =>
                                            setSelectedLocation(null)
                                        }
                                    >
                                        <FontAwesomeIcon icon={faXmark} />
                                    </button>
                                    <ChargerLocationFlow
                                        location={selectedLocation}
                                        setOpen={setSelectedLocation}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </MainBody>
        </div>
    )
}
