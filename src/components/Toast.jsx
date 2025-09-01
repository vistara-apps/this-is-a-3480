import { useState, useEffect } from 'react'
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react'

export default function Toast({ 
  message, 
  type = 'success', 
  duration = 5000, 
  onClose 
}) {
  const [isVisible, setIsVisible] = useState(true)
  
  // Auto-dismiss the toast after duration
  useEffect(() => {
    if (!duration) return
    
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onClose && onClose()
      }, 300) // Wait for fade out animation
    }, duration)
    
    return () => clearTimeout(timer)
  }, [duration, onClose])
  
  // Handle manual close
  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose && onClose()
    }, 300) // Wait for fade out animation
  }
  
  // Define styles based on toast type
  const typeStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: <CheckCircle className="h-5 w-5 text-green-500" aria-hidden="true" />,
      title: 'text-green-800'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />,
      title: 'text-red-800'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" aria-hidden="true" />,
      title: 'text-yellow-800'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: <Info className="h-5 w-5 text-blue-500" aria-hidden="true" />,
      title: 'text-blue-800'
    }
  }
  
  const styles = typeStyles[type] || typeStyles.info
  
  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 max-w-md w-full md:w-auto transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
      role="alert"
      aria-live="assertive"
    >
      <div className={`${styles.bg} ${styles.border} border rounded-lg shadow-lg p-4 flex items-start`}>
        <div className="flex-shrink-0 mr-3">
          {styles.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${styles.title}`}>
            {message}
          </p>
        </div>
        <button
          type="button"
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-full p-1"
          onClick={handleClose}
          aria-label="Close"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

// Toast Container Component to manage multiple toasts
export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

