import numericalSuffix from '../data/numericSuffix'
import Button from './Button'
import leaveQueue from '../data/leaveQueues'
import Modal from './Modal'

export default function LeaveQueueModal({ locations, setOpen, refresh }) {
    const handleChildElementClick = (e) => {
        if (e.target.type !== 'submit') {
            e.stopPropagation()
        }
    }

    const exit = () => {
        setOpen(false)
    }
    return (
        <Modal setOpen={setOpen}>
            <div className="flex flex-col justify-evenly h-full">
                {locations.length === 1 ? (
                    <div>
                        <h1 className="text-xl font-bold">
                            Are you sure you want to leave the queue?
                        </h1>
                        <h2 className="mt-4 ">
                            {locations[0].name}
                            <span className="text-gray">
                                {' '}
                                - {locations[0].wattage}kWh
                            </span>
                        </h2>
                        <p className="mt-4 text-accent">
                            Queue Position:{' '}
                            {numericalSuffix(locations[0].position)}
                        </p>
                    </div>
                ) : (
                    <h1 className="text-xl font-bold">
                        Are you sure you want to leave {locations.length}{' '}
                        queues?
                    </h1>
                )}

                <div className="flex w-full sm:flex-row flex-col p-2 justify-center">
                    <Button
                        id="button"
                        color="RED"
                        className="sm:w-1/3 w-full m-2"
                        onClick={async () => {
                            await leaveQueue(
                                locations.map((location) => location.locationID)
                            )
                            refresh()
                            exit()
                        }}
                    >
                        {location ? 'Leave Queue' : 'Leave Queues'}
                    </Button>
                    <Button
                        id="button"
                        color="WHITE"
                        className="sm:w-1/3 w-full m-2"
                        onClick={() => {
                            exit()
                        }}
                    >
                        Go back
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
