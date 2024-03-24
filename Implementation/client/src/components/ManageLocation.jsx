export default function ManageLocation({
    selectedLocation,
    deletionConfirm,
    setDeletionConfirm,
    DeleteLocation,
    setSelectedLocation,
    setSelectedLocCopy,
    updateFunction,
    setUpdated,
    selectedLocCopy,
    DeleteChargePoint,
}) {
    return (
        <div className="col-span-full xl:px-[10%] text-xl p-3 flex flex-col justify-between h-full ">
            <div className="flex justify-between">
                <input
                    value={selectedLocation.name}
                    onChange={(value) => {
                        selectedLocation.name = value
                    }}
                />
                {!deletionConfirm ? (
                    <button
                        className="bg-red p-2 text-white rounded-md"
                        onClick={() => {
                            setDeletionConfirm(true)
                        }}
                    >
                        DELETE LOCATION
                    </button>
                ) : (
                    <button
                        className="bg-red text-white p-2 rounded-md"
                        onClick={() => {
                            setDeletionConfirm(false)
                            DeleteLocation(selectedLocation)
                            setSelectedLocation(null)
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
                                wattage: selectedLocation.wattage,
                            }
                            wattCopy.wattage = e.target.value
                            setSelectedLocCopy(wattCopy)
                        }}
                        defaultValue={selectedLocation.wattage}
                        className="w-1/2 bg-opacity-0"
                        type="number"
                        min="0"
                        max="99"
                    />
                    <span className="w-1/2">kWh</span>
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
                    defaultValue={selectedLocation.lat}
                    className="w-2/5 border-solid border-2 border-gray rounded-lg px-1"
                    type="number"
                    min="0"
                    max="100"
                />
                <label>LNG</label>
                <input
                    onChange={(e) => {
                        console.log('here')
                        const lngCopy = {
                            ...selectedLocation,
                            ...selectedLocCopy,
                            lng: selectedLocation.lng,
                        }
                        console.log(lngCopy)
                        lngCopy.lng = e.target.value
                        console.log(lngCopy)
                        setSelectedLocCopy(lngCopy)
                    }}
                    defaultValue={selectedLocation.lng}
                    className="w-2/5 border-solid border-2 border-gray rounded-lg px-1"
                    type="number"
                    min="-5"
                    max="0"
                />
            </div>
            {selectedLocation.chargingPoint.map((charger, i) => (
                <div className="w-3/4 flex justify-between col-span-full">
                    <label for={`chargerStates${i}`}>{`Charger ${
                        i + 1
                    }`}</label>
                    <select
                        onChange={(e) => {
                            const locCopy = {
                                ...selectedLocation,
                                ...selectedLocCopy,
                                chargingPoint:
                                    selectedLocation.chargingPoint.slice(0),
                            }
                            locCopy.chargingPoint[i].status = e.target.value
                            locCopy.chargingPoint[i].updated = true

                            setSelectedLocCopy(locCopy)
                        }}
                        defaultValue={charger.status}
                        className="w-2/5 border-solid border-2 border-gray rounded-lg"
                        name={`chargerStates${i}`}
                    >
                        <option value="IDLE">Available</option>
                        <option value="CHARGING">In Use</option>
                        <option value="BROKEN">Broken</option>
                    </select>
                    <button
                        onClick={() => {
                            const locCopy = {
                                ...selectedLocation,
                                ...selectedLocCopy,
                                chargingPoint:
                                    selectedLocation.chargingPoint.slice(0),
                            }
                            DeleteChargePoint(locCopy.chargingPoint[i])
                        }}
                        className="bg-red p-2 rounded-md text-white"
                    >
                        Delete Charger
                    </button>
                </div>
            ))}
            <div>
                <button
                    className="w-1/2 bg-accent border-solid text-white border-2 border-white hover:border-black p-2 rounded-md"
                    onClick={() => {
                        console.log(selectedLocCopy)
                        updateFunction(selectedLocCopy)
                    }}
                >
                    Update Location Info
                </button>
                <button
                    className="w-1/2 bg-accent border-solid text-white border-2 border-white hover:border-black  p-2 rounded-md"
                    onClick={() => {
                        //if selectedLocCopy is empty use selectedLocation{

                        const newCP = {
                            chargingPointID: -1,
                            locationID: selectedLocation.locationID,
                            status: 'IDLE',
                        }

                        const addCopy = {
                            ...selectedLocation,
                            ...selectedLocCopy,
                        }
                        addCopy.chargingPoint.push(newCP)
                        updateFunction(addCopy)
                        setUpdated(false)
                    }}
                >
                    Add Charger
                </button>
            </div>
        </div>
    )
}
