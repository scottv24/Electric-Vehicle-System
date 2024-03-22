import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import getApiData from '../data/getApiData'
import Modal from './Modal'
import LocationInfo from './LocationInfo'
import Logo from './Logo'
import LoginForm from './forms/Login'
import { loggedInCheck } from '../data/login'
import { joinQueue } from '../data/joinQueue'
import Spinner from './Spinner'
import StatusInfo from './PendingInfo'

export default function ChargerModal({ location, setOpen }) {
    const { id } = useParams()
    const [locationInfo, setLocationInfo] = useState(null)
    const [loggedOut, setLoggedOut] = useState(false)
    const [action, setAction] = useState(null)
    const [chargerPointID, setCharger] = useState(null)
    const [chargerLocationID, setChargerLocationID] = useState(null)
    const [failure, setFail] = useState(false)
    useEffect(() => {
        const getLocation = async () => {
            const { location } = await getApiData(`location/${id}`)
            setLocationInfo(location)
        }

        const checkLoggedOut = async () => {
            const loggedOut = await loggedInCheck(true)
            setLoggedOut(loggedOut)
        }

        if (!location) {
            getLocation()
        } else {
            setLocationInfo(location)
        }
        checkLoggedOut()
    }, [])

    async function queue(locations) {
        const { chargerLocationID, chargingPointID, failure } = await joinQueue(
            locations
        )
        if (failure) {
            setFail(failure)
            return
        }
        if (chargerLocationID) {
            setCharger(chargingPointID)
            setChargerLocationID(chargerLocationID)
        }
    }

    if (action === 'RESERVE' && !loggedOut) {
        queue([locationInfo.locationID])
    }

    return (
        <Modal setOpen={setOpen} noSubmitExit={true}>
            {!action && (
                <LocationInfo
                    location={locationInfo}
                    className={'p-4'}
                    setAction={setAction}
                />
            )}
            {action && loggedOut && (
                <>
                    <Logo hw={true} titleStyle="landing" />
                    <LoginForm
                        message={
                            action === 'RESERVE'
                                ? 'to reserve charger'
                                : action === 'QUEUE'
                                ? 'to join queue'
                                : action === 'UPDATE'
                                ? 'to report charger status'
                                : ''
                        }
                        location={locationInfo.locationID}
                    />
                </>
            )}
            {action === 'RESERVE' && chargerPointID && !loggedOut && (
                <div className="flex flex-col justify-center text-center h-full align-middle overflow-hidden">
                    {chargerPointID ? (
                        <StatusInfo
                            status={{
                                chargingPointID: chargerPointID,
                                chargerLocationID,
                                location: locationInfo.name,
                                status: 'PENDING',
                            }}
                            modal={true}
                            refresh={() => setOpen(false)}
                        />
                    ) : (
                        <>
                            <Spinner />
                            <p className="text-accent text-xl">
                                Reserving Charger...
                            </p>
                        </>
                    )}
                </div>
            )}
            {failure && !chargerLocationID && (
                <p className="text-red font-bold text-lg">
                    Can't {action === 'RESERVE' ? 'reserve' : 'check into'}{' '}
                    charger while already assigned a charger.
                </p>
            )}
        </Modal>
    )
}
