import { Loader } from 'lucide-react'

export default function LoadingIndicator({ size = 'medium', text = 'Loading...', fullScreen = false }) {
  // Size variants
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  }
  
  // If fullScreen, show a centered loading indicator with backdrop
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 shadow-modal flex flex-col items-center">
          <Loader className={`${sizeClasses.large} text-primary animate-spin mb-4`} aria-hidden="true" />
          <p className="text-text font-medium">{text}</p>
        </div>
      </div>
    )
  }
  
  // Default inline loading indicator
  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex flex-col items-center">
        <Loader className={`${sizeClasses[size]} text-primary animate-spin mb-2`} aria-hidden="true" />
        {text && <p className="text-gray-600 text-sm">{text}</p>}
      </div>
    </div>
  )
}

