export default function AdminTable({
    chargeLocations,
    selectedLocation,
    setSelectedLocation,
}) {
    return (
        <table className="divide-y divide-solid table-auto w-full">
            <thead>
                <tr>
                    <th className="text-left px-4 py-2">Location</th>
                    <th className="px-4 py-2">No. Chargers</th>
                    <th className="px-4 py-2 md:table-cell hidden">
                        Available
                    </th>
                    <th className="px-4 py-2 md:table-cell hidden">In Queue</th>
                    <th className="px-4 py-2 md:table-cell hidden">Broken</th>
                    <th className="px-4 py-2 md:table-cell hidden">Wattage</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-solid">
                {chargeLocations.map((location) => (
                    <Locations
                        location={location}
                        selectedLocation={selectedLocation}
                        select={setSelectedLocation}
                    />
                ))}
            </tbody>
        </table>
    )
}

function Locations({ location, selectedLocation, select }) {
    const { name, chargingPoint, queue, wattage } = location
    const numChargers = chargingPoint.length
    const available = chargingPoint.filter(
        (charger) => charger.status === 'IDLE'
    )
    const broken = chargingPoint.filter(
        (charger) => charger.status === 'BROKEN'
    )
    return (
        <tr className="divide-solid bg-bg2 p-4">
            <td className="p-10 font-bold underline text-accent">
                <p
                    className="cursor-pointer"
                    onClick={() => {
                        select(location)
                    }}
                >
                    {name}
                </p>
            </td>
            <td className="text-center">{numChargers}</td>
            <td className="md:table-cell hidden text-center">
                {available.length}
            </td>
            <td className="md:table-cell hidden text-center">{queue.length}</td>
            <td className="md:table-cell hidden text-center">
                {broken.length}
            </td>
            <td className="md:table-cell hidden text-center">{wattage}kWh</td>
        </tr>
    )
}
