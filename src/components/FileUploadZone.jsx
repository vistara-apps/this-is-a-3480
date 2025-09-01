import { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image, AlertTriangle, Check, Camera } from 'lucide-react'

export default function FileUploadZone({ onFilesSelected }) {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [errors, setErrors] = useState([])
  
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  const ACCEPTED_TYPES = {
    'image/jpeg': ['.jpeg', '.jpg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'image/heic': ['.heic'],
    'image/heif': ['.heif']
  }
  
  // Generate previews for selected files
  useEffect(() => {
    // Revoke previous preview URLs to avoid memory leaks
    if (previewUrls.length > 0) {
      previewUrls.forEach(url => URL.revokeObjectURL(url.preview))
    }
    
    // Create new preview URLs
    const newPreviews = selectedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    
    setPreviewUrls(newPreviews)
    
    // Cleanup function to revoke URLs when component unmounts
    return () => {
      newPreviews.forEach(item => URL.revokeObjectURL(item.preview))
    }
  }, [selectedFiles])
  
  const validateFiles = (files) => {
    const newErrors = []
    
    files.forEach(file => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        newErrors.push(`${file.name} exceeds the 10MB size limit`)
      }
      
      // Check file type
      const fileType = file.type.toLowerCase()
      if (!Object.keys(ACCEPTED_TYPES).some(type => fileType.includes(type))) {
        newErrors.push(`${file.name} is not a supported image format`)
      }
    })
    
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles && rejectedFiles.length > 0) {
      const newErrors = rejectedFiles.map(rejected => 
        `${rejected.file.name}: ${rejected.errors[0].message}`
      )
      setErrors(prev => [...prev, ...newErrors])
    }
    
    // Validate and set accepted files
    if (validateFiles(acceptedFiles)) {
      setSelectedFiles(prev => [...prev, ...acceptedFiles])
    }
    
    setDragOver(false)
  }, [])

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    multiple: true,
    noClick: false,
    noKeyboard: false,
    maxSize: MAX_FILE_SIZE,
    onDragEnter: () => setDragOver(true),
    onDragLeave: () => setDragOver(false)
  })

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setErrors([]) // Clear errors when files change
  }

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onFilesSelected(selectedFiles)
    }
  }
  
  const clearAllFiles = () => {
    setSelectedFiles([])
    setErrors([])
  }

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
          isDragActive || dragOver
            ? 'border-primary bg-blue-50 shadow-md scale-[1.01]'
            : 'border-gray-300 hover:border-primary hover:bg-gray-50'
        }`}
        aria-label="Drop zone for uploading photos"
        role="button"
        tabIndex="0"
      >
        <input {...getInputProps()} aria-label="File input" />
        
        {isDragActive || dragOver ? (
          <div className="py-8">
            <Upload className="mx-auto h-16 w-16 text-primary animate-pulse mb-4" aria-hidden="true" />
            <p className="text-primary font-medium text-lg">Drop photos to upload...</p>
          </div>
        ) : (
          <div className="py-4 sm:py-6">
            <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" aria-hidden="true" />
            <p className="text-lg font-medium text-text mb-2">
              Drop photos here or click to browse
            </p>
            <p className="text-gray-600 mb-4">
              Supports JPEG, PNG, GIF, HEIC up to 10MB each
            </p>
            <button 
              type="button"
              onClick={open}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
              Browse Files
            </button>
          </div>
        )}
      </div>

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2" aria-hidden="true" />
            <div>
              <h4 className="text-sm font-medium text-red-800 mb-1">The following errors occurred:</h4>
              <ul className="text-sm text-red-700 space-y-1 list-disc pl-5">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Selected files */}
      {selectedFiles.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-text">
              Selected Files ({selectedFiles.length})
            </h3>
            <button
              onClick={clearAllFiles}
              className="text-sm text-gray-600 hover:text-red-500 transition-colors"
              aria-label="Clear all files"
            >
              Clear all
            </button>
          </div>
          
          {/* File previews */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {previewUrls.map((item, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                  <img
                    src={item.preview}
                    alt={`Preview of ${item.file.name}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md text-gray-400 hover:text-red-500 transition-colors"
                  aria-label={`Remove ${item.file.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="mt-1 text-xs text-gray-500 truncate px-1">
                  {item.file.name.length > 20 
                    ? item.file.name.substring(0, 18) + '...' 
                    : item.file.name}
                </div>
                <div className="text-xs text-gray-400 px-1">
                  {(item.file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            ))}
            
            {/* Add more button */}
            <div 
              onClick={open}
              className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
              role="button"
              tabIndex="0"
              aria-label="Add more photos"
            >
              <Upload className="h-8 w-8 text-gray-400 mb-2" aria-hidden="true" />
              <span className="text-sm text-gray-600">Add more</span>
            </div>
          </div>
          
          {/* Upload button */}
          <button 
            onClick={handleUpload} 
            disabled={selectedFiles.length === 0 || errors.length > 0}
            className={`btn-primary w-full flex items-center justify-center space-x-2 ${
              selectedFiles.length === 0 || errors.length > 0 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
            }`}
            aria-label="Process photos"
          >
            <Check className="h-5 w-5" aria-hidden="true" />
            <span>Process {selectedFiles.length} Photos</span>
          </button>
        </div>
      )}
    </div>
  )
}
