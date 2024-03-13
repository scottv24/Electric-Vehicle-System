import {
    faChargingStation,
    faStopwatch,
    faUser,
    faUserGear,
    faChartLine,
} from '@fortawesome/free-solid-svg-icons'

export const NavbarInfo = {
    admin: [
        {
            name: 'Chargers',
            path: 'Admin',
            icon: faChargingStation,
        },
        { name: 'Dashboard', path: 'dashboard', icon: faChartLine },
        {
            name: 'Admin Console',
            path: 'adminConsole',
            icon: faUserGear,
        },
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
