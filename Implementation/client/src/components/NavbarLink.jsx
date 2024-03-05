import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function NavbarLink({ field, active }) {
    return (
        <li
            className={` hover:font-bold font-semibold text-nav-primary md:w-full
             w-16 md:rounded-r-none rounded-full mt-9 ${
                 active
                     ? 'bg-nav-selected text-nav-selected'
                     : 'hover:bg-nav-hover'
             }`}
        >
            <a
                href={field.path}
                className="py-4 px-6 flex justify-start items-center w-full"
            >
                {field.icon && (
                    <FontAwesomeIcon icon={field.icon} className="mr-4" />
                )}
                <p className="md:block hidden">{field.name}</p>
            </a>
        </li>
    )
}
