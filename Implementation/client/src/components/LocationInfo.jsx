import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from './Button'
import Spinner from './Spinner'
import {
    faCaretDown,
    faCaretUp,
    faTriangleExclamation,
    faUserClock,
    faUserPlus,
} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'

export default function LocationInfo({ className, location, setAction }) {
    const [expandChargers, setExpandChargers] = useState(false)
    if (!location) {
        return <Spinner />
    }
    return (
        <div className={className}>
            <h1 className="font-bold text-xl">{location.name}</h1>
            <div className="grid grid-cols-2 my-8">
                <p className={expandChargers ? ' bg-gray bg-opacity-20' : ''}>
                    Chargers Available
                </p>

                <p
                    className={`font-bold text-gray hover:text-accent cursor-pointer ${
                        expandChargers && ' bg-gray bg-opacity-20'
                    }`}
                    onClick={() => setExpandChargers(!expandChargers)}
                >
                    {location.availability && location.availability.available}/
                    {location.availability && location.availability.numChargers}
                    {'  '}
                    <FontAwesomeIcon
                        icon={expandChargers ? faCaretUp : faCaretDown}
                        className="text-xl "
                    />
                </p>
                {expandChargers && (
                    <div className="col-span-2 bg-gray bg-opacity-20">
                        <div className=" grid grid-cols-2 text-base ">
                            {location.chargingPoint.map((charger, i) => {
                                let status, color
                                if (charger.status === 'IDLE') {
                                    status = 'Available'
                                } else if (charger.status === 'BROKEN') {
                                    status = 'Broken'
                                } else {
                                    status = 'In Use'
                                }

                                return (
                                    <>
                                        <p className="font-light ">
                                            Charger {i + 1}
                                        </p>
                                        <p
                                            className={`font-semibold ${
                                                charger.status === 'IDLE'
                                                    ? 'text-accent'
                                                    : charger.status ===
                                                      'BROKEN'
                                                    ? 'text-red'
                                                    : 'text-unavailable'
                                            }`}
                                        >
                                            {status}
                                        </p>
                                    </>
                                )
                            })}
                        </div>
                    </div>
                )}
                <p>Charger Speed</p>
                <p className="font-bold text-gray"> {location.wattage}kWh</p>
                <p>Queue Length </p>
                <p className="font-bold text-gray">
                    {typeof location.queue !== 'object' && location.queue}
                </p>
            </div>
            <div className="mt-8 flex justify-center flex-col items-center">
                {location.availability.available > 0 ? (
                    <Button
                        className="my-2"
                        color="GREEN"
                        onClick={() => {
                            setAction('RESERVE')
                        }}
                    >
                        Reserve Charger <FontAwesomeIcon icon={faUserClock} />
                    </Button>
                ) : (
                    <Button
                        className="my-2"
                        color="BLUE"
                        onClick={() => {
                            setAction('QUEUE')
                        }}
                    >
                        Join Queue <FontAwesomeIcon icon={faUserPlus} />
                    </Button>
                )}

                <Button
                    className="my-2"
                    color="RED"
                    onClick={() => {
                        setAction('UPDATE')
                    }}
                >
                    Update Charger Status{' '}
                    <FontAwesomeIcon icon={faTriangleExclamation} />
                </Button>
            </div>
        </div>
    )
}
