import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import Modal from './Modal'

export default function SwipeClose({ location, editing, setEditing }) {
    const [leaving, setLeaving] = useState(false)
    return (
        <>
            <div
                className={`transition-all duration-300 ${
                    editing ? 'w-1/5' : 'w-0'
                } bg-red text-white flex justify-center items-center lg:text-2xl text-lg `}
                onClick={() => setLeaving(true)}
            >
                {editing && <FontAwesomeIcon icon={faXmark} />}
            </div>
            {leaving && (
                <Modal
                    locations={[location]}
                    setOpen={(state) => {
                        setEditing(state)
                        setLeaving(state)
                    }}
                />
            )}
        </>
    )
}
