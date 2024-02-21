import Logo from './Logo'
import NavbarLink from './NavbarLink'

export default function Navbar({ active, type }) {
    let fields
    if (type === 'admin') {
        fields = [
            { name: 'CHargers', path: '/' },
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'Admin Console', path: '/adminConsole' },
        ]
    } else {
        fields = [
            { name: 'Chargers', path: '/chargers' },
            { name: 'Queues', path: '/queues' },
            { name: 'Profile', path: '/profile' },
        ]
    }

    return (
        <div class="flex flex-col items-center bg-white shadow h-full  w-1/4">
            <div class="h-16 flex items-center w-full p-6">
                <Logo hw={false} />
            </div>
            <hr className="text-gray p-2 w-4/5" />
            <ul className="w-4/5 self-end">
                {fields.map((field) => (
                    <NavbarLink field={field} active={field.name === active} />
                ))}
            </ul>
        </div>
    )
}
