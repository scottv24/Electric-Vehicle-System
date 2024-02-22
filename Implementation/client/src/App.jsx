import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Chargers from './pages/Chargers'
import Page from './pages/Page'
import QRCodePage from './pages/QRCode'

export default function App() {
    return (
        <div className="min-h-screen w-screen">
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/charger1" element={<QRCodePage />} />
                <Route
                    path="/chargers"
                    element={
                        <Page>
                            <Chargers />
                        </Page>
                    }
                />
            </Routes>
        </div>
    )
}
