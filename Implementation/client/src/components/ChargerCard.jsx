import Card from '../components/Card'
import AvailabilityDoughnut from './AvailibilityDoughnut'

export default function LocationCard({ location, queue }) {
    const chargers = location.chargingPoint || []
    const available = chargers.filter((charger) => charger.status === 'IDLE')
    console.log(location)
    return (
        <Card
            className="w-full rounded-md h-36 hover:cursor-pointer p-4"
            key={location.locationID}
        >
            <div className="flex justify-between h-full">
                <div className="w-3/4">
                    <h2 className="font-semibold text-lg">{location.name}</h2>

                    <p className="text-gray">{`${location.wattage}kWh`}</p>
                    {!queue && (
                        <p
                            className={`lg:hidden block ${
                                available.length ? 'text-accent' : 'text-red'
                            }`}
                        >
                            {available.length}/{chargers.length} Available
                        </p>
                    )}
                </div>
                {!queue ? (
                    <AvailabilityDoughnut location={location} />
                ) : (
                    <h2>{location.position}</h2>
                )}
            </div>
        </Card>
    )
}
