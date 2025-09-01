export default function PhotoGrid({ photos }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {photos.map(photo => (
        <div key={photo.id} className="relative group">
          <img
            src={photo.fileUrl}
            alt={photo.filename}
            className="w-full h-24 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-xs font-medium">{photo.damageType}</p>
            </div>
          </div>
          {photo.isDuplicate && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></div>
          )}
        </div>
      ))}
    </div>
  )
}