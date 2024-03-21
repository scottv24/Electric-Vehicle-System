import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import getApiData from '../data/getApiData'
import Modal from './Modal'
import LocationInfo from './LocationInfo'
import Logo from './Logo'
import LoginForm from './forms/Login'
import { loggedInCheck } from '../data/login'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

export default function ChargerModal({ location, setOpen }) {
    const { id } = useParams()
    const [locationInfo, setLocationInfo] = useState(null)
    const [loggedOut, setLoggedOut] = useState(false)
    const [action, setAction] = useState(null)

    useEffect(() => {
        const getLocation = async () => {
            const { location } = await getApiData(`location/${id}`)
            setLocationInfo(location)
        }

        const checkLoggedOut = async () => {
            const loggedOut = await loggedInCheck(true)
            console.log(loggedOut)
            setLoggedOut(loggedOut)
        }

        if (!location) {
            getLocation()
        } else {
            setLocationInfo(location)
        }
        checkLoggedOut()
    }, [])
    if (action === 'RESERVE') {
        console.log('here')
    }
    return (
        <Modal>
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
                    />
                </>
            )}
            {action === 'RESERVE' && !loggedOut && (
                <div className="flex flex-col justify-center p-4 text-center h-full align-middle">
                    <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-5xl text-accent"
                    />
                    <h2 className="text-accent text-xl my-8">
                        Charger 1 Successfully Reserved
                    </h2>
                    <p>
                        You have 30 mins to get to the charger before your
                        reservation will be cancelled.
                    </p>
                </div>
            )}
        </Modal>
    )
}
