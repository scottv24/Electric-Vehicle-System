import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlugCircleBolt } from '@fortawesome/free-solid-svg-icons'

export default function Logo({ hw }) {
  return (
    <div
      id='logoContainer'
      className='align-middle flex align-center justify-center'
    >
      <div id='logo'>
        <h1 className='text-accent font-bold lg:text-5xl md:text-4xl sm:text-3xl text-2xl'>
          Charge Checker
          <FontAwesomeIcon icon={faPlugCircleBolt} className='ml-4' />
        </h1>
        {hw && (
          <h2 className='text-center text-gray lg:text-xl md:text-lg sm:text-base text-sm p-2'>
            Heriot-Watt University
          </h2>
        )}
      </div>
    </div>
  )
}
