import {
    faArrowLeft,
    faCheckCircle,
    faClock,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ChargerStatusGrid from './ChargerStatusGrid'
import Modal from './Modal'
import { useState } from 'react'
import Button from './Button'
import updateCharger from '../data/updateCharger'

export default function ReportMenu({ chargers, setOpen, goBack }) {
    const [charger, setCharger] = useState(null)
    const [newStatus, setStatus] = useState(null)
    const [broken, setBroken] = useState(false)
    const [updateMessage, setMessage] = useState('')
    const [complete, setComplete] = useState('')

    return (
        <Modal setOpen={setOpen} noSubmitExit={true}>
            <FontAwesomeIcon icon={faArrowLeft} onClick={() => goBack()} />
            <div className="flex flex-col h-full">
                {!charger ? (
                    <>
                        <p className="font-bold">Click charger to update</p>
                        <ChargerStatusGrid
                            chargers={chargers}
                            interactive={true}
                            selectCharger={setCharger}
                        />
                    </>
                ) : (
                    <>
                        <p className="font-bold text-xl">
                            Update Charger {charger.chargerLocationID} Status
                        </p>
                        <div className="flex flex-col justify-center align-middle items-center h-full">
                            {!broken && !complete && (
                                <div className="w-full flex justify-center flex-col items-center my-6">
                                    <p>New Status</p>
                                    <select
                                        defaultValue={charger.simplifiedStatus}
                                        className="p-2  w-3/4"
                                        onChange={(e) =>
                                            setStatus(e.target.value)
                                        }
                                    >
                                        <option value="IDLE">Available</option>
                                        <option value="CHARGING">In Use</option>
                                        <option value="BROKEN">Broken</option>
                                    </select>
                                </div>
                            )}
                            {broken &&
                                charger.status !== 'RESERVED' &&
                                !complete && (
                                    <div className="w-3/4 my-2">
                                        {' '}
                                        <textarea
                                            placeholder="Whats wrong with charger..."
                                            className="border-2 border-accent w-full rounded-md  text-base"
                                            onChange={(e) =>
                                                setMessage(e.target.value)
                                            }
                                            maxLength={250}
                                        ></textarea>
                                        <p className="text-right text-sm">
                                            {updateMessage.length}/250
                                        </p>
                                    </div>
                                )}
                            {broken && charger.status === 'RESERVED' && (
                                <div className="w-full flex flex-col justify-center items-center text-center">
                                    <FontAwesomeIcon
                                        icon={faClock}
                                        className="text-3xl text-accent"
                                    />
                                    <p>Thank you for your update!</p>
                                    <p>
                                        This charger is currently reserved by
                                        another user in the queue. So is
                                        currently marked as in use.
                                    </p>
                                </div>
                            )}
                            {complete && (
                                <div className="w-full flex flex-col justify-center items-center text-center">
                                    <FontAwesomeIcon
                                        icon={faCheckCircle}
                                        className="text-3xl text-accent"
                                    />
                                    <p>Thank you for your update!</p>
                                    <p>
                                        {broken
                                            ? 'Your update has been submitted for review.'
                                            : 'The charger status will now be updated.'}
                                    </p>
                                </div>
                            )}

                            {newStatus === 'BROKEN' && !broken ? (
                                <Button
                                    color={'GREEN'}
                                    onClick={() => setBroken(true)}
                                >
                                    Next
                                </Button>
                            ) : (!broken || !charger.status !== 'PENDING') &&
                              !complete ? (
                                <Button
                                    color={'GREEN'}
                                    onClick={async () => {
                                        let success
                                        if (!broken) {
                                            success = await updateCharger(
                                                charger.chargingPointID,
                                                newStatus
                                            )
                                        } else {
                                            success = await updateCharger(
                                                charger.chargingPointID,
                                                newStatus,
                                                updateMessage
                                            )
                                        }
                                        setComplete(success)
                                    }}
                                >
                                    Send Update
                                </Button>
                            ) : (
                                <Button
                                    color={'GREEN'}
                                    onClick={() => setOpen(false)}
                                >
                                    Exit
                                </Button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </Modal>
    )
}
