import MainBody from '../components/MainBody'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'
import { findManyChargeLocations } from '../dummyData/BackendData'
import Spinner from '../components/Spinner'
import getApiData from '../data/getApiData'
import AdminTable from '../components/AdminTable'
import Axios from 'axios'

export default function Admin() {
    const [chargeLocations, setChargeLocations] = useState(null)
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [adding, setNotAdding] = useState(null)
    const [selectedLocCopy, setSelectedLocCopy] = useState(null)
    const [updated, setUpdated] = useState(true)
    useEffect(() => {
        async function getChargers() {
            const { chargers } = await getApiData('chargers')
            if (chargers) {
                setChargeLocations(chargers)
            }
        }
        if (!updated) {
            getChargers()
        } else {
            setUpdated(false)
        }
    }, [updated])

    return (
        <div className="w-full flex bg-bg">
            <Navbar active={'Chargers'} type="admin" />
            <MainBody>
                <Spinner enabled={!chargeLocations} />
                {
                    //TODO: Fix scrolling so only table scrolls
                    chargeLocations && (
                        <Card className="min-h-[400px] sm:w-full w-full sm:h-full sm:h-auto overflow-auto">
                            <div className="w-full h-1/6 flex justify-stretch">
                                <button className="w-1/2">Table View</button>
                                <button className="w-1/2 bg-bg2 text-lg hover:bg-white hover:border-2 hover: border-black">
                                    Map View
                                </button>
                            </div>
                            <div className="p-4  grid-cols-4 h-full">
                                <div className="flex">
                                    <h1 className="w-full col-span-3 mt-0 text-3xl font-bold flex justify-left items-center">
                                        Charging Locations
                                    </h1>
                                    <div className=" w-full flex items-center">
                                        {selectedLocation ? (
                                            <button
                                                className="w-full hover: border-black bg-accent py-2 text-white text-bold rounded-l rounded-r align-right"
                                                onClick={() => {
                                                    setSelectedLocation(null)
                                                }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faArrowLeft}
                                                />{' '}
                                                Back
                                            </button>
                                        ) : (
                                            <button
                                                className="w-full hover: border-black bg-accent py-2 text-white text-bold rounded-l rounded-r align-right"
                                                onClick={() => {
                                                    setSelectedLocation(null)
                                                }}
                                            >
                                                Add{' '}
                                                <FontAwesomeIcon
                                                    icon={faPlus}
                                                />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {!selectedLocation ? (
                                    <AdminTable
                                        chargeLocations={chargeLocations}
                                        setSelectedLocation={
                                            setSelectedLocation
                                        }
                                        selectedLocation={selectedLocation}
                                    ></AdminTable>
                                ) : (
                                    <div className="col-span-full xl:px-[10%] text-xl p-3 flex flex-col justify-between h-full">
                                        <div>
                                            <input
                                                value={selectedLocation.name}
                                                onChange={(value) => {
                                                    selectedLocation.name =
                                                        value
                                                }}
                                            />
                                        </div>
                                        <div className="w-3/4 flex justify-between">
                                            <label>Wattage</label>
                                            <div className="w-2/5 border-solid border-2 border-gray rounded-lg">
                                                <input
                                                    defaultValue={
                                                        selectedLocation.wattage
                                                    }
                                                    className="w-1/2 bg-opacity-0"
                                                    type="number"
                                                    min="0"
                                                    max="99"
                                                />
                                                <span className="w-1/2">
                                                    kWh
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-3/4 flex justify-between">
                                            <label>LAT</label>
                                            <input
                                                defaultValue={
                                                    selectedLocation.lat
                                                }
                                                className="w-2/5 border-solid border-2 border-gray rounded-lg px-1"
                                                type="number"
                                                min="0"
                                                max="100"
                                            />
                                            <label>LNG</label>
                                            <input
                                                defaultValue={
                                                    selectedLocation.lng
                                                }
                                                className="w-2/5 border-solid border-2 border-gray rounded-lg px-1"
                                                type="number"
                                                min="0"
                                                max="100"
                                            />
                                        </div>

                                        {selectedLocation.chargingPoint.map(
                                            (charger, i) => (
                                                <div className="w-3/4 flex justify-between col-span-full">
                                                    <label
                                                        for={`chargerStates${i}`}
                                                    >{`Charger ${
                                                        i + 1
                                                    }`}</label>
                                                    <select
                                                        onChange={(e) => {
                                                            const locCopy = {
                                                                ...selectedLocation,
                                                                chargingPoint:
                                                                    selectedLocation.chargingPoint.slice(
                                                                        0
                                                                    ),
                                                            }
                                                            locCopy.chargingPoint[
                                                                i
                                                            ].status =
                                                                e.target.value
                                                            locCopy.chargingPoint[
                                                                i
                                                            ].updated = true

                                                            setSelectedLocCopy(
                                                                locCopy
                                                            )
                                                        }}
                                                        defaultValue={
                                                            charger.status
                                                        }
                                                        className="w-2/5 border-solid border-2 border-gray rounded-lg"
                                                        name={`chargerStates${i}`}
                                                    >
                                                        <option value="IDLE">
                                                            Available
                                                        </option>
                                                        <option value="CHARGING">
                                                            In Use
                                                        </option>
                                                        <option value="BROKEN">
                                                            Broken
                                                        </option>
                                                    </select>
                                                    <button
                                                        onClick={() => {
                                                            updateFunction(
                                                                selectedLocCopy
                                                            )
                                                        }}
                                                    >
                                                        Update Charger
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </Card>
                    )
                }
            </MainBody>
        </div>
    )
}

async function updateFunction(location) {
    const response = await Axios.patch(
        'http://localhost:3000/api/admin/update-location',
        location,
        {}
    )
    return
}
