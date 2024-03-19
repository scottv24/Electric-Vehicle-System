export default function MainBody({ children }) {
    return (
        <div className="flex flex-col w-full h-full md:px-16 md:pt-16 px-8 pt-8 ">
            {children}
        </div>
    )
}
