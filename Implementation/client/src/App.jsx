import { Route, Routes, useParams } from 'react-router-dom'
import Login from './pages/Login'
import Chargers from './pages/Chargers'
import Page from './pages/Page'
import Admin from './pages/Admin'
import AdminConsole from './pages/AdminConsole'
import Reports from './pages/Reports'
import Queues from './pages/Queues'
import ChargerLocationFlow from './components/ChargerLocationFlow'
import Map from './components/Map'
import { frontendURL, rootURL } from './Env'
import Profile from './pages/Profile'
import Modal from './components/Modal'

export default function App() {
    return (
        <div className="min-h-screen w-screen">
            <Routes>
                <Route path="/" element={<Login />} />
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
                    path="/Reports"
                    element={
                        <Page>
                            {' '}
                            <Reports />
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
                <Route
                    path="/charger/:id"
                    element={
                        <Modal
                            setOpen={(open) => {
                                if (!open) {
                                    window.location.replace(frontendURL)
                                }
                            }}
                        >
                            <ChargerLocationFlow
                                setOpen={(open) => {
                                    if (!open) {
                                        window.location.replace(rootURL)
                                    }
                                }}
                            />
                        </Modal>
                    }
                />
                <Route
                    path="profile"
                    element={
                        <Page>
                            <Profile />
                        </Page>
                    }
                />
            </Routes>
        </div>
    )
}
