import MainBody from '../components/MainBody'
import Navbar from '../components/Navbar'
import { useState, useEffect } from 'react'
import Spinner from '../components/Spinner'
import getApiData from '../data/getApiData'
import LocationCard from '../components/ChargerCard'
import numericalSuffix from '../data/numericSuffix'
import Button from '../components/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import LeaveQueueModal from '../components/LeaveQueueModal'
import StatusInfo from '../components/PendingInfo'

export default function Queues() {
    const [queues, setQueues] = useState(null)
    const [leaving, setLeaving] = useState(false)
    const [leavingSelector, setLeavingSelector] = useState(false)
    const [selectedQueues, setSelectedQueues] = useState({})
    const [refresh, setRefresh] = useState(true)
    const [status, setStatus] = useState(null)
    useEffect(() => {
        if (!refresh) {
            return
        }
        async function getQueues() {
            const status = await getApiData('account/status')
            if (status.status === 'PENDING' || status.status === 'CHARGING') {
                setStatus(status)
                return
            } else {
                setStatus(null)
            }
            const { queues } = await getApiData('queues')
            if (queues) {
                setQueues(queues)
            }
        }
        getQueues()
        setRefresh(false)
    }, [refresh])

    return (
        <div className="w-full flex">
            <Navbar active={'Queues'} type="client" />
            <MainBody>
                <h1 className="font-bold text-3xl p-2 w-full">Queues</h1>
                <Spinner enabled={!queues && !status} />
                {status && (
                    <div className="p-8 flex flex-col justify-center align-middle text-center font-bold">
                        <StatusInfo
                            status={status}
                            refresh={() => setRefresh(true)}
                        />
                    </div>
                )}
                {queues && (
                    <div className="mx-auto w-3/4 flex flex-col items-center gap-3 overflow-y-auto no-scrollbar pb-10">
                        {queues.length > 0 ? (
                            <>
                                <div className="text-accent font-semibold text-center text-lg py-8">
                                    <p>Your Closest Position Is</p>
                                    <p className="text-2xl font-extrabold">
                                        {numericalSuffix(queues[0].position)}
                                    </p>
                                    <p className="text-black">
                                        At the National Robotarium
                                    </p>
                                </div>
                                <div className="flex sm:flex-row flex-col w-1/2 justify-between">
                                    <Button
                                        color={'RED'}
                                        className={`w-1/4 sm:w-full align-middle m-2`}
                                        onClick={() => {
                                            if (leavingSelector) {
                                                setLeaving(true)
                                            } else {
                                                setLeavingSelector(true)
                                            }
                                        }}
                                    >
                                        Leave <FontAwesomeIcon icon={faXmark} />
                                    </Button>
                                    {leavingSelector ? (
                                        <Button
                                            color={'WHITE'}
                                            className={`w-1/4 sm:w-full align-middle m-2`}
                                            onClick={() => {
                                                setLeavingSelector(false)
                                                setSelectedQueues({})
                                            }}
                                        >
                                            Cancel{' '}
                                            <FontAwesomeIcon icon={faXmark} />
                                        </Button>
                                    ) : (
                                        <Button
                                            color={'RED'}
                                            className={`w-1/4 sm:w-full align-middle m-2`}
                                            onClick={() => {
                                                setLeaving(true)
                                                const allQueues = {}
                                                queues.forEach(
                                                    (queue) =>
                                                        (allQueues[
                                                            queue.locationID
                                                        ] = {
                                                            locationID:
                                                                queue.locationID,
                                                        })
                                                )

                                                setSelectedQueues(allQueues)
                                            }}
                                        >
                                            Leave All{' '}
                                            <FontAwesomeIcon icon={faXmark} />
                                        </Button>
                                    )}
                                </div>

                                <p
                                    className={`transition duration-300 ${
                                        leavingSelector
                                            ? 'text-opacity-100'
                                            : 'text-opacity-0'
                                    } font-bold text-gray`}
                                >
                                    Please select queues you want to leave.
                                </p>

                                {queues.map((location) => {
                                    return (
                                        <LocationCard
                                            location={location}
                                            queue={true}
                                            key={location.locationID + 'Card'}
                                            leavingSelector={leavingSelector}
                                            selected={
                                                selectedQueues[
                                                    location.locationID
                                                ]
                                            }
                                            setLeaving={() => setLeaving(true)}
                                            setSelected={(bool) => {
                                                if (bool) {
                                                    setSelectedQueues({
                                                        ...selectedQueues,
                                                        [location.locationID]:
                                                            location,
                                                    })
                                                } else {
                                                    const copy = {
                                                        ...selectedQueues,
                                                    }
                                                    delete copy[
                                                        location.locationID
                                                    ]
                                                    setSelectedQueues(copy)
                                                }
                                            }}
                                        />
                                    )
                                })}
                            </>
                        ) : (
                            <div className="text-accent font-semibold text-center text-lg py-8">
                                <p>You are currently not in any queues.</p>
                                <p className="text-black">
                                    Once you join a queue for a charging
                                    location, you will be able to track your
                                    position here.
                                </p>
                            </div>
                        )}
                    </div>
                )}
                {leaving && (
                    <LeaveQueueModal
                        setOpen={(open) => {
                            setLeaving(open)
                            if (!open) {
                                setLeavingSelector(false)
                                setSelectedQueues({})
                            }
                        }}
                        locations={Object.values(selectedQueues)}
                        refresh={() => setRefresh(true)}
                    />
                )}
            </MainBody>
        </div>
    )
}
