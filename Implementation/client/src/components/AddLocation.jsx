import Modal from './Modal'

export default function AddLocationMenu({
    setAdding,
    setUpdated,
    AddLocation,
}) {
    return (
        <Modal setOpen={() => setAdding(false)}>
            <div>
                <h1 className="w-full text-center text-xl font-bold">
                    Add Charge Location Here
                </h1>
                <label class="block text-black text-m font-bold m-3" for="name">
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
                            document.getElementById('name').value,
                            document.getElementById('wattage').value,
                            document.getElementById('latitude').value,
                            document.getElementById('longitude').value,
                            document.getElementById('noChargers').value
                        )
                        setUpdated(false)
                    }}
                >
                    Add New Location
                </button>
            </div>
        </Modal>
    )
}
