import Card from '../components/Card'
import AvailabilityDoughnut from './AvailibilityDoughnut'
import numericalSuffix from '../data/numericSuffix'
import { useSwipeable } from 'react-swipeable'
import { useState } from 'react'
import SwipeClose from './SwipeClose'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-regular-svg-icons'

export default function LocationCard({
    location,
    queue,
    leavingSelector,
    selected,
    setSelected,
}) {
    const chargers = location.chargingPoint || []
    const available = chargers.filter((charger) => charger.status === 'IDLE')

    const handlers = useSwipeable({
        onSwipedLeft: () => !leavingSelector && setEditing(true),
        onSwipedRight: () => !leavingSelector && setEditing(false),
    })

    const [editing, setEditing] = useState(false)

    return (
        <div {...handlers} className="w-full flex">
            <Card
                className="rounded-md h-36 hover:cursor-pointer lg:p-8 p-4"
                key={location.locationID}
                onClick={() => {
                    setEditing(false)
                    if (leavingSelector) {
                        setSelected(!selected)
                    }
                }}
            >
                <div className="flex justify-between h-full">
                    <div
                        className={`transition-all duration-300 ${
                            leavingSelector ? 'w-1/5' : 'w-0'
                        } text-3xl self-center overflow-hidden`}
                    >
                        <FontAwesomeIcon
                            icon={selected ? faXmarkCircle : faCircle}
                            className={`transition delay-150 duration-300 text-red ${
                                leavingSelector
                                    ? 'text-opacity-100'
                                    : 'text-opacity-0'
                            }`}
                        />
                    </div>

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
                        <div className="font-bold text-accent text-center flex flex-col justify-center w-1/4">
                            <p className="lg:text-xl text-lg">
                                {numericalSuffix(location.position)}{' '}
                            </p>
                            <p className="lg:text-lg text-base">In Queue</p>
                        </div>
                    )}
                </div>
            </Card>
            <SwipeClose
                location={location}
                editing={editing && !leavingSelector}
                setEditing={setEditing}
            />
        </div>
    )
}
