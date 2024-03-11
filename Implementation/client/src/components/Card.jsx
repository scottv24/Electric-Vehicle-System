export default function Card({ children, ...props }) {
    return (
        <div
            className={props.className + ' w-full bg-white shadow-xl '}
            onClick={props.onClick}
        >
            {children}
        </div>
    )
}
