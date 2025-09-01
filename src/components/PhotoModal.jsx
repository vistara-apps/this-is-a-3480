import { useState, useEffect, useCallback } from 'react'
import { X, Tag, AlertTriangle, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, MapPin } from 'lucide-react'

export default function PhotoModal({ claim, photos, onClose }) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(null)
  const [filterType, setFilterType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Filter photos based on damage type and search term
  const filteredPhotos = photos.filter(photo => {
    const matchesType = filterType === 'all' || photo.damageType === filterType
    const matchesSearch = photo.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesType && matchesSearch
  })
  
  // Get unique damage types for filter
  const damageTypes = [...new Set(photos.map(photo => photo.damageType))]
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (activePhotoIndex !== null) {
      // ESC key closes the detail view
      if (e.key === 'Escape') {
        setActivePhotoIndex(null)
      }
      // Left arrow navigates to previous photo
      else if (e.key === 'ArrowLeft') {
        setActivePhotoIndex(prev => 
          prev > 0 ? prev - 1 : filteredPhotos.length - 1
        )
      }
      // Right arrow navigates to next photo
      else if (e.key === 'ArrowRight') {
        setActivePhotoIndex(prev => 
          prev < filteredPhotos.length - 1 ? prev + 1 : 0
        )
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }, [activePhotoIndex, filteredPhotos.length, onClose])
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
  
  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      if (activePhotoIndex !== null) {
        setActivePhotoIndex(null)
      } else {
        onClose()
      }
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-surface rounded-xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-modal">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b">
          <div>
            <h2 id="modal-title" className="text-lg sm:text-xl font-semibold text-text">Photos for {claim.claimNumber}</h2>
            <p className="text-gray-600">{filteredPhotos.length} of {photos.length} photos</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Photo Detail View */}
        {activePhotoIndex !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-[60] flex flex-col">
            <div className="flex justify-between items-center p-4 text-white">
              <button 
                onClick={() => setActivePhotoIndex(null)}
                className="flex items-center space-x-2 hover:text-gray-300 transition-colors"
                aria-label="Back to gallery"
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Back to gallery</span>
              </button>
              <div className="text-sm">
                {activePhotoIndex + 1} of {filteredPhotos.length}
              </div>
              <button 
                onClick={onClose}
                className="hover:text-gray-300 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 flex items-center justify-center relative">
              {/* Previous button */}
              <button 
                onClick={() => setActivePhotoIndex(prev => prev > 0 ? prev - 1 : filteredPhotos.length - 1)}
                className="absolute left-4 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white transition-colors"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              {/* Photo */}
              <div className="max-w-4xl max-h-[70vh] relative">
                <img
                  src={filteredPhotos[activePhotoIndex].fileUrl}
                  alt={filteredPhotos[activePhotoIndex].filename}
                  className="max-h-[70vh] max-w-full object-contain"
                />
              </div>
              
              {/* Next button */}
              <button 
                onClick={() => setActivePhotoIndex(prev => prev < filteredPhotos.length - 1 ? prev + 1 : 0)}
                className="absolute right-4 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white transition-colors"
                aria-label="Next photo"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
            
            {/* Photo details */}
            <div className="bg-gray-900 text-white p-4">
              <div className="max-w-4xl mx-auto">
                <h3 className="font-medium mb-2">{filteredPhotos[activePhotoIndex].filename}</h3>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    <span>{filteredPhotos[activePhotoIndex].damageType}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{filteredPhotos[activePhotoIndex].location}</span>
                  </div>
                  <div>
                    Quality: {Math.round(filteredPhotos[activePhotoIndex].qualityScore)}%
                  </div>
                </div>
                
                {filteredPhotos[activePhotoIndex].tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {filteredPhotos[activePhotoIndex].tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-900 text-blue-100 px-2 py-1 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="p-4 border-b flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search photos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 py-2"
              aria-label="Search photos"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="flex items-center space-x-2">
            <label htmlFor="damage-type-filter" className="text-sm text-gray-600 whitespace-nowrap">
              Damage Type:
            </label>
            <select
              id="damage-type-filter"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field py-2"
            >
              <option value="all">All Types</option>
              {damageTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Photo Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
          {filteredPhotos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPhotos.map((photo, index) => (
                <div 
                  key={photo.id} 
                  className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setActivePhotoIndex(index)}
                  tabIndex="0"
                  role="button"
                  aria-label={`View details of ${photo.filename}`}
                  onKeyDown={(e) => e.key === 'Enter' && setActivePhotoIndex(index)}
                >
                  <div className="relative">
                    <img
                      src={photo.fileUrl}
                      alt={photo.filename}
                      className="w-full h-40 sm:h-48 object-cover"
                      loading="lazy"
                    />
                    {photo.isDuplicate && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md" title="Duplicate photo detected">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white text-sm font-medium">{photo.damageType}</span>
                        <span className="text-white text-xs bg-black/50 px-2 py-1 rounded-full">
                          {Math.round(photo.qualityScore)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-text text-sm mb-2 truncate">{photo.filename}</p>
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" aria-hidden="true" />
                        {photo.location}
                      </span>
                    </div>
                    {photo.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {photo.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {photo.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{photo.tags.length - 3} more</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No photos match your filters</p>
              <button 
                onClick={() => {setFilterType('all'); setSearchTerm('')}}
                className="mt-3 text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
