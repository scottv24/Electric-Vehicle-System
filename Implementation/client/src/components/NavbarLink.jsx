import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function NavbarLink({ field, active }) {
    return (
        <li
            class={` hover:font-bold font-semibold text-nav-primary w-full rounded-l-full mt-9 ${
                active
                    ? 'bg-nav-selected text-nav-selected'
                    : 'hover:bg-nav-hover'
            }`}
        >
            <a
                href={field.path}
                class="py-4 px-6 flex justify-start items-center w-full"
            >
                {field.icon && (
                    <FontAwesomeIcon icon={field.icon} className="mr-4" />
                )}
                {field.name}
            </a>
        </li>
    )
}
