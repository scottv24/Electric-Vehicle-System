import {
    faCarSide,
    faCheckCircle,
    faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from './Button'
import { cancelReservation, checkIn, checkOut } from '../data/joinQueue'

export default function StatusInfo({ status, startTime, refresh, modal }) {
    console.log(status)
    const { location, chargerLocationID, chargingPointID } = status
    return (
        <>
            <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-5xl text-accent"
            />
            <h2 className="text-accent text-xl my-8">
                {location} - Charger {chargerLocationID} Successfully{' '}
                {status.status === 'PENDING' ? 'Reserved' : 'Checked In'}
            </h2>
            {status.status === 'PENDING' && (
                <p>
                    You have 30 mins to get to the charger before your
                    reservation will be cancelled.
                </p>
            )}
            <div
                className={`${
                    modal ? '' : 'my-16'
                } flex flex-col justify-center w-full`}
            >
                <div className="w-full md:w-2/3 mx-auto">
                    {status.status === 'PENDING' ? (
                        <>
                            <Button
                                color={'GREEN'}
                                className={`${modal ? 'my-1' : 'my-8'}`}
                                onClick={async () => {
                                    const success = await checkIn(
                                        chargingPointID
                                    )
                                    if (success) {
                                        refresh()
                                    }
                                }}
                            >
                                Check In <FontAwesomeIcon icon={faCarSide} />
                            </Button>
                            <Button
                                color={'RED'}
                                onClick={async () => {
                                    const success = await cancelReservation()
                                    if (success) {
                                        refresh()
                                    }
                                }}
                            >
                                Cancel Reservation{' '}
                                <FontAwesomeIcon icon={faXmark} />
                            </Button>
                        </>
                    ) : (
                        <Button
                            color={'RED'}
                            onClick={async () => {
                                const success = await checkOut()
                                if (success) {
                                    refresh()
                                }
                            }}
                        >
                            Check Out <FontAwesomeIcon icon={faXmark} />
                        </Button>
                    )}
                </div>
            </div>
        </>
    )
}
