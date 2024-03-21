export default function Button({ color, children, ...props }) {
    let styling = 'bg-accent text-white'

    if (color === 'WHITE') {
        styling = 'border-gray bg-gray bg-opacity-5 border-2 text-black'
    } else if (color === 'RED') {
        styling = 'bg-red text-white'
    } else if (color === 'BLUE') {
        styling = 'bg-unavailable text-white'
    }

    return (
        <button
            className={`${styling} ${props.className} p-2 rounded-lg text-center text-lg font-bold sm:w-3/4 w-full`}
            onClick={props.onClick}
        >
            {...children}
        </button>
    )
}
