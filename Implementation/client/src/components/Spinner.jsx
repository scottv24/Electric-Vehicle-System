import SpinnerSVG from '../public/SpinnerSVG.svg'

export default function Spinner({ enabled }) {
    if (enabled) {
        return (
            <div class="flex justify-center items-center h-full">
                <img src={SpinnerSVG} className="w-1/12 p-4" />
            </div>
        )
    }
    return null
}
