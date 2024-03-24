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
import ManageLocation from '../components/ManageLocation'
import AddLocationMenu from '../components/AddLocation'

export default function Admin() {
    const [chargeLocations, setChargeLocations] = useState(null)
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [adding, setAdding] = useState(null)
    const [selectedLocCopy, setSelectedLocCopy] = useState({})
    const [updated, setUpdated] = useState(true)
    const [deletionConfirm, setDeletionConfirm] = useState(false)
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
    //todo need to setAdding(false) somewhere so location adding function is not visable after clicking location but i dont know how to do x&y condition for rendering with shorthand notation
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
                                                    setAdding(true)
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
                                    <ManageLocation
                                        DeleteLocation={DeleteLocation}
                                        deletionConfirm={deletionConfirm}
                                        selectedLocation={selectedLocation}
                                        setDeletionConfirm={setDeletionConfirm}
                                        setSelectedLocCopy={setSelectedLocCopy}
                                        setSelectedLocation={
                                            setSelectedLocation
                                        }
                                        setUpdated={setUpdated}
                                        updateFunction={updateFunction}
                                        selectedLocCopy={selectedLocCopy}
                                        DeleteChargePoint={DeleteChargePoint}
                                    />
                                )}
                                {adding ? (
                                    <AddLocationMenu
                                        AddLocation={AddLocation}
                                        setAdding={setAdding}
                                        setUpdated={setUpdated}
                                    />
                                ) : null}
                            </div>
                        </Card>
                    )
                }
            </MainBody>
        </div>
    )
}

async function updateFunction(location) {
    try {
        if (location) {
            const response = await Axios.patch(
                'http://localhost:3000/api/admin/update-location',
                location,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': '1',
                    },
                }
            )
            window.location.reload()
        } else {
            console.log('No changes made')
        }
    } catch (err) {
        return
    }
}

async function DeleteChargePoint(body) {
    const { chargingPointID } = body
    const response = await Axios.patch(
        'http://localhost:3000/api/admin/delete-charging-point',
        { chargingPointID },
        {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '1',
            },
        }
    )
    window.location.reload()
}

async function DeleteLocation(body) {
    const { locationID } = body
    const response = await Axios.patch(
        'http://localhost:3000/api/admin/delete-location',
        { locationID },
        {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '1',
            },
        }
    )
    window.location.reload()
}

async function AddLocation(name, wattage, lat, lng, noChargers) {
    try {
        const body = {
            name,
            wattage,
            lat,
            lng,
            noChargers,
            chargingPoint: [],
        }
        const response = await Axios.patch(
            'http://localhost:3000/api/admin/update-location',
            body,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '1',
                },
            }
        )
        window.location.reload()
    } catch (err) {
        return
    }
}
