import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

export default function SwipeClose({ editing, leave }) {
    return (
        <>
            <div
                className={`transition-all duration-300 ${
                    editing ? 'w-1/5' : 'w-0'
                } bg-red text-white flex justify-center items-center lg:text-2xl text-lg `}
                onClick={() => leave()}
            >
                {editing && <FontAwesomeIcon icon={faXmark} />}
            </div>
        </>
    )
}
