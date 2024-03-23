import { Route, Routes, useParams } from 'react-router-dom'
import Login from './pages/Login'
import Chargers from './pages/Chargers'
import Page from './pages/Page'
import Admin from './pages/Admin'
import AdminConsole from './pages/AdminConsole'
import Reports from './pages/Reports'
import Queues from './pages/Queues'
import ChargerModal from './components/ChargerModal'
import { rootURL } from './Env'

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
                        <ChargerModal
                            setOpen={(open) => {
                                if (!open) {
                                    window.location.replace(rootURL)
                                }
                            }}
                        />
                    }
                />
            </Routes>
        </div>
    )
}
