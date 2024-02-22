import {
    faChargingStation,
    faStopwatch,
    faUser,
    faUserGear,
    faChartLine,
} from '@fortawesome/free-solid-svg-icons'

export const NavbarInfo = {
    admin: [
        { name: 'Chargers', path: '/', icon: faChargingStation },
        { name: 'Dashboard', path: '/dashboard', icon: faChartLine },
        { name: 'Admin Console', path: '/adminConsole', icon: faUserGear },
    ],
    client: [
        { name: 'Chargers', path: '/chargers', icon: faChargingStation },
        { name: 'Queues', path: '/queues', icon: faStopwatch },
        { name: 'Profile', path: '/profile', icon: faUser },
    ],
}
