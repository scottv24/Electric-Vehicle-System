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
                                    <div className="col-span-full xl:px-[10%] text-xl p-3 flex flex-col justify-between h-full ">
                                        <div className="flex justify-between">
                                            <input
                                                value={selectedLocation.name}
                                                onChange={(value) => {
                                                    selectedLocation.name =
                                                        value
                                                }}
                                            />
                                            {!deletionConfirm ? (
                                                <button
                                                    className="bg-red"
                                                    onClick={() => {
                                                        setDeletionConfirm(true)
                                                    }}
                                                >
                                                    DELETE LOCATION
                                                </button>
                                            ) : (
                                                <button
                                                    className="bg-red"
                                                    onClick={() => {
                                                        setDeletionConfirm(
                                                            false
                                                        )
                                                        DeleteLocation(
                                                            selectedLocation
                                                        )
                                                        setSelectedLocation(
                                                            null
                                                        )
                                                    }}
                                                >
                                                    CONFIRM DELETION
                                                </button>
                                            )}
                                        </div>
                                        <div className="w-3/4 flex justify-between">
                                            <label>Wattage</label>
                                            <div className="w-2/5 border-solid border-2 border-gray rounded-lg">
                                                <input
                                                    onChange={(e) => {
                                                        const wattCopy = {
                                                            ...selectedLocation,
                                                            ...selectedLocCopy,
                                                            wattage:
                                                                selectedLocation.wattage,
                                                        }
                                                        wattCopy.wattage =
                                                            e.target.value
                                                        setSelectedLocCopy(
                                                            wattCopy
                                                        )
                                                    }}
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
                                                onChange={(e) => {
                                                    const latCopy = {
                                                        ...selectedLocation,
                                                        ...selectedLocCopy,
                                                        lat: selectedLocation.lat,
                                                    }
                                                    latCopy.lat = e.target.value

                                                    setSelectedLocCopy(latCopy)
                                                }}
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
                                                onChange={(e) => {
                                                    const lngCopy = {
                                                        ...selectedLocation,
                                                        ...selectedLocCopy,
                                                        lng: selectedLocation.lng,
                                                    }
                                                    lngCopy.lng = e.target.value

                                                    setSelectedLocCopy(lngCopy)
                                                }}
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
                                                                ...selectedLocCopy,
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
                                                            const locCopy = {
                                                                ...selectedLocation,
                                                                ...selectedLocCopy,
                                                                chargingPoint:
                                                                    selectedLocation.chargingPoint.slice(
                                                                        0
                                                                    ),
                                                            }
                                                            DeleteChargePoint(
                                                                locCopy
                                                                    .chargingPoint[
                                                                    i
                                                                ]
                                                            )
                                                        }}
                                                    >
                                                        Delete Charger
                                                    </button>
                                                </div>
                                            )
                                        )}
                                        <div>
                                            <button
                                                className="w-1/2 bg-accent border-solid text-white border rounded hover:border-2 hover: border-black"
                                                onClick={() => {
                                                    updateFunction(
                                                        selectedLocCopy
                                                    )
                                                }}
                                            >
                                                Update Location Info
                                            </button>
                                            <button
                                                className="w-1/2 bg-accent border-solid text-white border rounded hover:border-2 hover: border-black"
                                                onClick={() => {
                                                    //if selectedLocCopy is empty use selectedLocation{

                                                    const newCP = {
                                                        chargingPointID: -1,
                                                        locationID:
                                                            selectedLocation.locationID,
                                                        status: 'IDLE',
                                                    }

                                                    const addCopy = {
                                                        ...selectedLocation,
                                                        ...selectedLocCopy,
                                                    }
                                                    addCopy.chargingPoint.push(
                                                        newCP
                                                    )
                                                    updateFunction(addCopy)
                                                    setUpdated(false)
                                                }}
                                            >
                                                Add Charger
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {adding ? (
                                    <div>
                                        <h1 className="w-full text-center text-xl font-bold">
                                            Add Charger Here
                                        </h1>
                                        <label
                                            class="block text-black text-m font-bold m-3"
                                            for="name"
                                        >
                                            Name Of Location
                                        </label>
                                        <input
                                            className="w-3/4 border border-solid p-0 m-3 flex justify-between"
                                            id="name"
                                        ></input>
                                        <label
                                            class="block text-black text-m font-bold m-3"
                                            for="wattage"
                                        >
                                            Wattage
                                        </label>
                                        <input
                                            className="w-3/4 border border-solid p-0 m-3"
                                            id="wattage"
                                        ></input>
                                        <label
                                            class="block text-black text-m font-bold m-3"
                                            for="latitude"
                                        >
                                            Latitude
                                        </label>
                                        <input
                                            className="w-3/4 border border-solid p-0 m-3"
                                            id="latitude"
                                        ></input>
                                        <label
                                            class="block text-black text-m font-bold m-3"
                                            for="longitude"
                                        >
                                            Longitude
                                        </label>
                                        <input
                                            className="w-3/4 border border-solid p-0 m-3"
                                            id="longitude"
                                        ></input>
                                        <label
                                            class="block text-black text-m font-bold m-3"
                                            for="noChargers"
                                        >
                                            Number Of Chargers
                                        </label>
                                        <input
                                            className="w-3/4 border border-solid p-0 m-3"
                                            id="noChargers"
                                        ></input>
                                        <button
                                            className="w-full hover: border-black bg-accent py-2 text-white text-bold rounded-l rounded-r align-right"
                                            onClick={() => {
                                                setAdding(false)

                                                AddLocation(
                                                    document.getElementById(
                                                        'name'
                                                    ).value,
                                                    document.getElementById(
                                                        'wattage'
                                                    ).value,
                                                    document.getElementById(
                                                        'latitude'
                                                    ).value,
                                                    document.getElementById(
                                                        'longitude'
                                                    ).value,
                                                    document.getElementById(
                                                        'noChargers'
                                                    ).value
                                                )
                                                setUpdated(false)
                                            }}
                                        >
                                            Add New Location
                                        </button>
                                    </div>
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
    if (location) {
        const response = await Axios.patch(
            'http://localhost:3000/api/admin/update-location',
            location,
            {}
        )
    } else {
        console.log('No changes made')
    }
    return
}

async function DeleteChargePoint(body) {
    const response = await Axios.delete(
        'http://localhost:3000/api/admin/delete-charging-point',
        { data: body }
    )
}

async function DeleteLocation(body) {
    //TODO havent tested but i assume this works
    const response = await Axios.delete(
        'http://localhost:3000/api/admin/delete-location',
        { data: body }
    )
}

async function AddLocation(name, wattage, lat, lng, noChargers) {
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
        {}
    )
}
