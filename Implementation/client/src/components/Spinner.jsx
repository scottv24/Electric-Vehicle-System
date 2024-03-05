import SpinnerSVG from '../public/SpinnerSVG.svg'

export default function Spinner({ enabled }) {
    if (enabled) {
        return (
            <div class="flex justify-center items-center h-full w-full">
                <img
                    src={SpinnerSVG}
                    className="xl:w-1/12 md:w-1/6 sm:w-1/4 w-1/4 sm:p-4 p-0"
                />
            </div>
        )
    }
    return null
}
