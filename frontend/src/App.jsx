import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import KuesionerPage from './pages/KuesionerPage'
import RiwayatPage from './pages/riwayat/RiwayatPage'
import ProfilPage from './pages/profil/ProfilPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/kuesioner" element={<KuesionerPage />} />
        <Route path="/riwayat" element={<RiwayatPage />} />
        <Route path="/profil" element={<ProfilPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
