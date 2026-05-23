import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import KuesionerPage from './pages/KuesionerPage'
import RiwayatPage from './pages/riwayat/RiwayatPage'
import ProfilPage from './pages/profil/ProfilPage'
import { getUser } from './services/api'

function ProtectedRoute({ children }) {
  if (!getUser()) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/kuesioner" element={<ProtectedRoute><KuesionerPage /></ProtectedRoute>} />
        <Route path="/riwayat" element={<ProtectedRoute><RiwayatPage /></ProtectedRoute>} />
        <Route path="/profil" element={<ProtectedRoute><ProfilPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
