import Button from './Button'
import Spinner from './Spinner'

export default function LocationInfo({ className, location }) {
    if (!location) {
        return <Spinner />
    }
    return (
        <div className={className}>
            <h1 className="font-bold text-xl">{location.name}</h1>
            <div className="grid grid-cols-2 my-8">
                <p>Chargers Available</p>
                <p className="font-bold text-gray">
                    {location.availability && location.availability.available}/
                    {location.availability && location.availability.numChargers}
                </p>
                <p>Charger Speed</p>
                <p className="font-bold text-gray"> {location.wattage}kWh</p>
                <p>Queue Length </p>
                <p className="font-bold text-gray">
                    {typeof location.queue !== 'object' && location.queue}
                </p>
            </div>
            <div className="mt-8 flex justify-center">
                <Button color="GREEN">Reserve Charger</Button>
            </div>
        </div>
    )
}
