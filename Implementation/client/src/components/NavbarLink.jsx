export default function NavbarLink({ field, active }) {
    return (
        <li
            class={`hover:bg-accent hover:bg-opacity-90 hover:font-bold font-medium w-full rounded-l-full hover:text-white my-8 ${
                active && 'bg-accent text-white'
            }`}
        >
            <a
                href={field.path}
                class="py-4 px-6 flex justify-center items-center w-full"
            >
                {field.name}
            </a>
        </li>
    )
}
