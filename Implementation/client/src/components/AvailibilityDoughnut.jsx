import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faCheck } from '@fortawesome/free-solid-svg-icons'

ChartJS.register(ArcElement, Tooltip)

export default function AvailabilityDoughnut({ location }) {
    const chargers = location.chargingPoint
    const available = chargers.filter((charger) => charger.status === 'IDLE')
    const broken = chargers.filter((charger) => charger.status === 'BROKEN')
    const availableCount = available.length
    const brokenCount = broken.length
    const inUseCount = chargers.length - (availableCount + brokenCount)

    const data = {
        labels: ['Available', 'In Use', 'Broken'],
        datasets: [
            {
                data: [availableCount, inUseCount, brokenCount],
                backgroundColor: ['#047508', '#0101C6', '#E5261F'],
            },
        ],
    }
    return (
        <div className="lg:flex hidden w-2/5 flex-col h-full overflow-hidden items-center">
            <div className="h-3/4">
                <Doughnut
                    data={data}
                    width="80%"
                    options={{ maintainAspectRatio: false }}
                />
            </div>
            <div>
                <p
                    className={`${
                        availableCount ? 'text-accent' : 'text-red'
                    } font-bold xl:text-base text-sm`}
                >
                    {availableCount} Available{' '}
                    <FontAwesomeIcon
                        icon={availableCount ? faCheck : faXmark}
                    />
                </p>
            </div>
        </div>
    )
}
