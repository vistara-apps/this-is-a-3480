import { X, Tag, AlertTriangle, Download } from 'lucide-react'

export default function PhotoModal({ claim, photos, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-text">Photos for {claim.claimNumber}</h2>
            <p className="text-gray-600">{photos.length} photos</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map(photo => (
              <div key={photo.id} className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={photo.fileUrl}
                    alt={photo.filename}
                    className="w-full h-48 object-cover"
                  />
                  {photo.isDuplicate && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                    Quality: {Math.round(photo.qualityScore)}%
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-medium text-text text-sm mb-2 truncate">{photo.filename}</p>
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span>{photo.damageType}</span>
                    <span>{photo.location}</span>
                  </div>
                  {photo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {photo.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}