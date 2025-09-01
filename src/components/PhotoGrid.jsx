import { AlertTriangle, Eye } from 'lucide-react'

export default function PhotoGrid({ photos }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
      {photos.map(photo => (
        <div 
          key={photo.id} 
          className="relative group overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
          role="button"
          tabIndex="0"
          aria-label={`Photo: ${photo.filename}, Damage type: ${photo.damageType}`}
        >
          <img
            src={photo.fileUrl}
            alt={photo.filename}
            className="w-full h-20 sm:h-24 object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-2">
            <div className="text-white text-xs font-medium truncate max-w-[80%]">
              {photo.damageType}
            </div>
            <Eye className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          {photo.isDuplicate && (
            <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md" title="Duplicate photo detected">
              <AlertTriangle className="h-3 w-3" aria-hidden="true" />
            </div>
          )}
          {photo.qualityScore < 70 && !photo.isDuplicate && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white rounded-full p-1 shadow-md" title="Low quality image">
              <AlertTriangle className="h-3 w-3" aria-hidden="true" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
