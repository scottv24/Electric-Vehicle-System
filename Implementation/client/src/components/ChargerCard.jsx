import Card from '../components/Card'
import AvailabilityDoughnut from './AvailibilityDoughnut'
import numericalSuffix from '../data/numericSuffix'
import { useSwipeable } from 'react-swipeable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import Modal from './Modal'

export default function LocationCard({ location, queue }) {
    const chargers = location.chargingPoint || []
    const available = chargers.filter((charger) => charger.status === 'IDLE')

    const handlers = useSwipeable({
        onSwipedLeft: () => setEditing(true),
        onSwipedRight: () => setEditing(false),
    })

    const [editing, setEditing] = useState(false)
    const [leaving, setLeaving] = useState(false)

    return (
        <div {...handlers} className="w-full flex">
            <Card
                className="rounded-md h-36 hover:cursor-pointer lg:p-8 p-4"
                key={location.locationID}
                onClick={() => setEditing(false)}
            >
                <div className="flex justify-between h-full">
                    <div className="w-3/4">
                        <h2 className="font-semibold text-lg">
                            {location.name}
                        </h2>

                        <p className="text-gray">{`${location.wattage}kWh`}</p>
                        {!queue && (
                            <p
                                className={`lg:hidden block ${
                                    available.length
                                        ? 'text-accent'
                                        : 'text-red'
                                }`}
                            >
                                {available.length}/{chargers.length} Available
                            </p>
                        )}
                    </div>
                    {!queue ? (
                        <AvailabilityDoughnut location={location} />
                    ) : (
                        <div className="font-bold text-accent text-center flex flex-col justify-center">
                            <p className="lg:text-xl text-lg">
                                {numericalSuffix(location.position)}{' '}
                            </p>
                            <p className="lg:text-lg text-base">In Queue</p>
                        </div>
                    )}
                </div>
            </Card>
            <div
                className={`transition-all duration-300 ${
                    editing ? 'w-1/5' : 'w-0'
                } bg-red w-1/5 text-white flex justify-center items-center lg:text-2xl text-lg `}
                onClick={() => setLeaving(true)}
            >
                {editing && <FontAwesomeIcon icon={faXmark} />}
            </div>
            {leaving && (
                <Modal
                    location={location}
                    setOpen={(state) => {
                        setEditing(state)
                        setLeaving(state)
                    }}
                />
            )}
        </div>
    )
}
