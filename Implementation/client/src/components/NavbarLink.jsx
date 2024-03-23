import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function NavbarLink({ field, active, mobile, reportCount }) {
    console.log(reportCount)
    if (mobile) {
        return (
            <div
                className={` hover:font-bold font-semibold text-nav-primary md:w-full
         w-16 md:rounded-r-none rounded-full mt-2 aspect-square h-2/3 ${
             active ? 'bg-nav-selected text-nav-selected' : 'hover:bg-nav-hover'
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
            </div>
        )
    }
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
                <p
                    className={`md:block hidden overflow-hidden ${
                        field.path === 'reports' ? 'text-nowrap' : ''
                    }`}
                >
                    {field.name}{' '}
                    {field.path === 'reports' && (
                        <span className="bg-white text-accent font-bold rounded-full aspect-square px-2">
                            {reportCount}
                        </span>
                    )}
                </p>
            </a>
        </li>
    )
}
