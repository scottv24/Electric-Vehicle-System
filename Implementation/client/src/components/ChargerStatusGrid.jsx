import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function ChargerStatusGrid({
    chargers,
    interactive,
    selectCharger,
}) {
    return (
        <div className="flex flex-col text-base">
            {chargers.map((charger, i) => {
                let status
                if (charger.status === 'IDLE') {
                    status = 'Available'
                } else if (charger.status === 'BROKEN') {
                    status = 'Broken'
                } else {
                    status = 'In Use'
                }

                return (
                    <div
                        className={`flex justify-between ${
                            interactive
                                ? 'hover:bg-accent hover:bg-opacity-10 hover:cursor-pointer'
                                : ''
                        }`}
                        onClick={() => {
                            if (interactive) {
                                charger.chargerLocationID = i + 1
                                charger.simplifiedStatus = charger.status
                                if (charger.simplifiedStatus === 'PENDING') {
                                    charger.simplifiedStatus = 'CHARGING'
                                }
                                selectCharger(charger)
                            }
                        }}
                    >
                        <p className="font-light w-1/2">Charger {i + 1}</p>
                        <div className="flex justify-between w-1/2">
                            <p
                                className={`font-semibold ${
                                    charger.status === 'IDLE'
                                        ? 'text-accent'
                                        : charger.status === 'BROKEN'
                                        ? 'text-red'
                                        : 'text-unavailable'
                                }`}
                            >
                                {status}
                            </p>
                            {interactive && (
                                <FontAwesomeIcon
                                    icon={faChevronRight}
                                    className="text-gray text-xl"
                                />
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
