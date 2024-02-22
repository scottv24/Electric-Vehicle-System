import MainBody from '../components/MainBody'
import Navbar from '../components/Navbar'

export default function Chargers() {
    return (
        <div className="w-full flex">
            <Navbar active={'Chargers'} type="client" />
            <MainBody>
                <h1 className="font-bold text-3xl p-2">Chargers</h1>
            </MainBody>
        </div>
    )
}
