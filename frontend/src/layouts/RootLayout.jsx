import { Outlet } from 'react-router-dom'
import Navbar from '@/components/shell/Navbar'
import Footer from '@/components/shell/Footer'
import { useTheme } from '@/context/ThemeContext'

const RootLayout = () => {
  useTheme() // ensure provider present; class usage handled by CSS vars
  return (
    <div className="min-h-screen" style={{ background: 'var(--page-bg)', color: 'var(--text-primary)' }}>
      <Navbar />
      <main className="pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default RootLayout
