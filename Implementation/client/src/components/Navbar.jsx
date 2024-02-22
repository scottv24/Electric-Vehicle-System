import { NavbarInfo } from '../data/navbars'
import Logo from './Logo'
import NavbarLink from './NavbarLink'

export default function Navbar({ active, type }) {
    const fields = NavbarInfo[type]

    return (
        <div
            className={`${type}-theme flex flex-col items-center bg-nav-standard shadow h-full w-1/5`}
        >
            <div className="justify-center flex items-center w-full p-6">
                <Logo hw={false} />
            </div>
            <hr className="text-nav-primary p-2 w-4/5" />
            <ul className="w-4/5 self-end">
                {fields &&
                    fields.map((field) => (
                        <NavbarLink
                            field={field}
                            active={field.name === active}
                        />
                    ))}
            </ul>
        </div>
    )
}
