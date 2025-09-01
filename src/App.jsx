import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect, createContext, useContext } from 'react'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import Claims from './pages/Claims'
import Reports from './pages/Reports'
import Integrations from './pages/Integrations'
import Settings from './pages/Settings'
import { ClaimProvider } from './context/ClaimContext'
import { mockUser } from './utils/mockData'
import LoadingIndicator from './components/LoadingIndicator'
import ErrorBoundary from './components/ErrorBoundary'
import { ToastContainer } from './components/Toast'

// Create a context for toast notifications
const ToastContext = createContext()

export function useToast() {
  return useContext(ToastContext)
}

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toasts, setToasts] = useState([])
  const location = useLocation()
  
  // Add a toast notification
  const addToast = (message, type = 'success', duration = 5000) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, message, type, duration }])
    return id
  }
  
  // Remove a toast notification
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }
  
  // Clear all toasts
  const clearToasts = () => {
    setToasts([])
  }
  
  // Reset scroll position when route changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    // Simulate authentication
    setTimeout(() => {
      setUser(mockUser)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-24 h-24 bg-white rounded-xl shadow-lg p-5 mb-4">
            <div className="animate-spin rounded-full h-full w-full border-b-2 border-primary"></div>
          </div>
          <h1 className="text-2xl font-bold text-text mb-2">ClaimSnap AI</h1>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <ToastContext.Provider value={{ addToast, removeToast, clearToasts }}>
      <ErrorBoundary>
        <ClaimProvider>
          <div className="min-h-screen bg-background">
            <Navbar user={user} />
            <main className="pt-16 pb-16">
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/upload" element={<Upload />} />
                  <Route path="/claims" element={<Claims />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/integrations" element={<Integrations />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </ErrorBoundary>
            </main>
            
            {/* Toast notifications */}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
          </div>
        </ClaimProvider>
      </ErrorBoundary>
    </ToastContext.Provider>
  )
}

export default App
