import {
    faChargingStation,
    faStopwatch,
    faUser,
    faUserGear,
    faChartLine,
    faArrowLeft,
} from '@fortawesome/free-solid-svg-icons'

export const NavbarInfo = {
    admin: [
        {
            name: 'Chargers',
            path: 'Admin',
            icon: faChargingStation,
        },
        { name: 'Reports', path: 'reports', icon: faChartLine },
        {
            name: 'Admin Console',
            path: 'adminConsole',
            icon: faUserGear,
        },
        { name: 'Main Site', path: 'chargers', icon: faArrowLeft },
    ],
    client: [
        {
            name: 'Chargers',
            path: '/hwcharging/chargers',
            icon: faChargingStation,
        },
        { name: 'Queues', path: '/hwcharging/queues', icon: faStopwatch },
        { name: 'Profile', path: '/hwcharging/profile', icon: faUser },
    ],
}
