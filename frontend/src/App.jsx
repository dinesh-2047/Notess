import { Navigate, Route, Routes } from 'react-router-dom'

import RootLayout from '@/layouts/RootLayout'
import AdminLayout from '@/layouts/admin/AdminLayout'
import LandingPage from '@/pages/LandingPage'
import ExplorePage from '@/pages/ExplorePage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import VerifyOtpPage from '@/pages/auth/VerifyOtpPage'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import AdminResourcesPage from '@/pages/admin/AdminResourcesPage'
import AdminUsersPage from '@/pages/admin/AdminUsersPage'
import AdminResourceUploadPage from '@/pages/admin/AdminResourceUploadPage'
import AboutPage from '@/pages/AboutPage'
import TeamPage from '@/pages/TeamPage'
import { useAuth } from '@/context/AuthContext'

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-100">
        <p className="animate-pulse text-lg font-semibold">Loading experience...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="auth">
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="verify" element={<VerifyOtpPage />} />
        </Route>
        <Route path="dashboard" element={<Navigate to="/" replace />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="resources" element={<AdminResourcesPage />} />
        <Route path="resources/upload" element={<AdminResourceUploadPage />} />
        <Route path="users" element={<AdminUsersPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
