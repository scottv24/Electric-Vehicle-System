import Logo from '../components/Logo'
import Card from '../components/Card'
import QRCode from '../components/forms/QRCode'

export default function QRCodePage() {
    return (
        <div className="flex justify-center items-center h-screen bg-bg">
            <Card className="min-h-[400px] p-8 grid grid-cols-1 sm:w-auto w-full sm:h-auto h-full content-around">
                <Logo hw={true} titleStyle="landing" />
                <QRCode />
            </Card>
        </div>
    )
}
