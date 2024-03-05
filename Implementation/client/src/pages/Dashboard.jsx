import MainBody from '../components/MainBody'
import Navbar from '../components/Navbar'
import Card from '../components/Card'

export default function Dashboard() {
    console.log('test')
    return (
        <div className="w-full flex">
            <Navbar active={'Dashboard'} type="admin" />
            <MainBody>
                <h1 className="font-bold text-3xl p-2">Dashboard</h1>
                <Card className="min-h-[400px] p-8 grid grid-cols-1 sm:w-full w-full sm:h-auto h-full content-around"></Card>
            </MainBody>
        </div>
    )
}
