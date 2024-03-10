import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Chargers from './pages/Chargers'
import Page from './pages/Page'
import QRCodePage from './pages/QRCode'
import Admin from './pages/Admin'
import AdminConsole from './pages/AdminConsole'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar'
import Queues from './pages/Queues'

export default function App() {
    return (
        <div className="min-h-screen w-screen">
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/charger1" element={<QRCodePage />} />
                <Route
                    path="/Admin"
                    element={
                        <Page>
                            {' '}
                            <Admin />
                        </Page>
                    }
                />
                <Route
                    path="/AdminConsole"
                    element={
                        <Page>
                            {' '}
                            <AdminConsole />
                        </Page>
                    }
                />
                <Route
                    path="/Dashboard"
                    element={
                        <Page>
                            {' '}
                            <Dashboard />
                        </Page>
                    }
                />
                <Route
                    path="/chargers"
                    element={
                        <Page>
                            <Chargers />
                        </Page>
                    }
                />
                <Route
                    path="/queues"
                    element={
                        <Page>
                            <Queues />
                        </Page>
                    }
                />
            </Routes>
        </div>
    )
}
