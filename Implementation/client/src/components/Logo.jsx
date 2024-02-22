import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlugCircleBolt } from '@fortawesome/free-solid-svg-icons'

export default function Logo({ hw, titleStyle }) {
    const landingPage = 'lg:text-5xl text-4xl'
    const navbar = 'lg:text-2xl text-xl'
    return (
        <div
            id="logoContainer"
            className="align-middle flex align-center justify-center"
        >
            <div id="logo">
                <h1
                    className={`text-nav-primary font-bold ${
                        titleStyle === 'landing' ? landingPage : navbar
                    }`}
                >
                    Charge Checker
                    <FontAwesomeIcon icon={faPlugCircleBolt} className="ml-4" />
                </h1>
                {hw && (
                    <h2 className="text-center text-gray lg:text-xl md:text-lg text-base p-2">
                        Heriot-Watt University
                    </h2>
                )}
            </div>
        </div>
    )
}
