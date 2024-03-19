import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import getApiData from '../data/getApiData'
import Modal from './Modal'
import LocationInfo from './LocationInfo'

export default function ChargerModal({ location, setOpen }) {
    const { id } = useParams()
    const [locationInfo, setLocationInfo] = useState(null)

    useEffect(() => {
        const getLocation = async () => {
            const { location } = await getApiData(`chargers/location/${id}`)
            setLocationInfo(location)
        }
        if (!location) {
            getLocation()
        } else {
            setLocationInfo(location)
        }
    }, [])

    return (
        <Modal setOpen={setOpen}>
            <LocationInfo location={locationInfo} className={'p-4'} />
        </Modal>
    )
}
