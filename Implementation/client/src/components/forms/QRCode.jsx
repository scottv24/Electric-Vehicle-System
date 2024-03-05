export default function QRCode() {
    return (
        <div className="flex flex-col items-center gap-3 p-4">
            <div className="flex flex-col items-center gap-1 p-4">
                <h2 className="text-lg font-semibold">National Robotarium</h2>
                <h3 className="text-lg font-semibold">Charge Point 1</h3>
                <h4 className="text-md font-medium text-unavailable">
                    Charger Unavailable
                </h4>
            </div>

            <button className="bg-unavailable text-white p-2 rounded-lg  text-lg font-bold sm:w-3/4 w-full">
                Join Queue
            </button>
            <button className="bg-white border-gray border-2 text-black p-2 rounded-lg  text-lg font-bold sm:w-3/4 w-full">
                Change Charger
            </button>
        </div>
    )
}
