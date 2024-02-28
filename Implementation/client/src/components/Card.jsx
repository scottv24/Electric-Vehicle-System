export default function Card({ children, ...props }) {
    console.log(children)
    return (
        <div className={props.className + ' w-full p-4 bg-white shadow-xl '}>
            {children}
        </div>
    )
}
