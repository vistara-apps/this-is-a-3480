import { X, Tag, AlertTriangle, Download, Brain, Gauge, MapPin, CheckCircle2 } from 'lucide-react'

export default function PhotoModal({ claim, photos, onClose }) {
  // Get severity color based on severity level
  const getSeverityColor = (level) => {
    switch (level) {
      case 'low':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get confidence badge color
  const getConfidenceBadge = (confidence) => {
    if (confidence >= 90) return 'bg-green-100 text-green-800';
    if (confidence >= 70) return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-text">Photos for {claim.claimNumber}</h2>
            <p className="text-gray-600">{photos.length} photos analyzed by AI</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map(photo => (
              <div key={photo.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={photo.fileUrl}
                    alt={photo.filename}
                    className="w-full h-48 object-cover"
                  />
                  {photo.isDuplicate && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full" title="Potential duplicate">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                  )}
                  
                  {/* Severity indicator */}
                  <div className={`absolute top-2 left-2 ${getSeverityColor(photo.severityLevel)} text-white px-2 py-1 rounded-full text-xs flex items-center`}>
                    <Gauge className="h-3 w-3 mr-1" />
                    {photo.severityLevel === 'low' ? 'Low' : 
                     photo.severityLevel === 'medium' ? 'Medium' : 
                     photo.severityLevel === 'high' ? 'High' : 'Unknown'} Severity
                  </div>
                  
                  {/* Quality score */}
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                    Quality: {Math.round(photo.qualityScore)}%
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-text text-sm truncate flex-1">{photo.filename}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getConfidenceBadge(photo.confidence)}`}>
                      {photo.confidence}% confidence
                    </span>
                  </div>
                  
                  {/* Damage type and location */}
                  <div className="flex flex-col gap-2 mb-3">
                    <div className="flex items-center text-xs">
                      <Brain className="h-3 w-3 text-purple-500 mr-1" />
                      <span className="font-medium text-gray-700">Damage Type:</span>
                      <span className="ml-1 text-gray-600">{photo.damageTypeName || photo.damageType}</span>
                    </div>
                    
                    <div className="flex items-center text-xs">
                      <MapPin className="h-3 w-3 text-blue-500 mr-1" />
                      <span className="font-medium text-gray-700">Location:</span>
                      <span className="ml-1 text-gray-600">{photo.location}</span>
                    </div>
                    
                    {photo.severityDescription && (
                      <div className="text-xs text-gray-600 italic">
                        "{photo.severityDescription}"
                      </div>
                    )}
                  </div>
                  
                  {/* Tags */}
                  {photo.tags && photo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {photo.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Anomalies */}
                  {photo.anomalies && photo.anomalies.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-700 mb-1 flex items-center">
                        <AlertTriangle className="h-3 w-3 text-amber-500 mr-1" />
                        Detected Anomalies:
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {photo.anomalies.map((anomaly, index) => (
                          <li key={index} className="flex items-start">
                            <span className={`inline-block w-2 h-2 rounded-full mt-1 mr-1 ${
                              anomaly.severity === 'high' ? 'bg-red-500' : 
                              anomaly.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}></span>
                            {anomaly.description}
                          </li>
                        ))}
                      </ul>
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
