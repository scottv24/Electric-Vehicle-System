import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Chargers from './pages/Chargers'

export default function App() {
    return (
        <div className="min-h-screen">
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/chargers" element={<Chargers />} />
            </Routes>
        </div>
    )
}
