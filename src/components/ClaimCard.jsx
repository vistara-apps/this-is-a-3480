import { formatDistanceToNow } from 'date-fns'
import { Eye, Calendar, MapPin, Brain, AlertTriangle, Gauge } from 'lucide-react'

export default function ClaimCard({ claim, photoCount, onViewPhotos, aiSummary }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'review': return 'bg-orange-100 text-orange-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Get severity color based on average severity
  const getSeverityColor = (score) => {
    if (!score) return 'text-gray-600';
    if (score < 40) return 'text-green-600';
    if (score < 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Determine if there are critical anomalies
  const hasCriticalAnomalies = aiSummary && aiSummary.criticalAnomalyCount > 0;

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-text mb-1">{claim.claimNumber}</h3>
          <div className="flex flex-wrap gap-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(claim.status)}`}>
              {claim.status}
            </span>
            
            {aiSummary && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 flex items-center">
                <Brain className="h-3 w-3 mr-1" />
                AI Analyzed
              </span>
            )}
            
            {hasCriticalAnomalies && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Critical Findings
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onViewPhotos}
          className="text-primary hover:text-blue-700 transition-colors"
        >
          <Eye className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          {claim.propertyAddress}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          {formatDistanceToNow(new Date(claim.dateReported), { addSuffix: true })}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">Damage Type</p>
          <p className="font-medium text-text">
            {aiSummary?.primaryDamageTypeName || claim.damageType}
          </p>
        </div>
        <div className="text-center">
          {aiSummary && (
            <div>
              <p className="text-sm text-gray-600">Avg. Severity</p>
              <p className={`font-medium ${getSeverityColor(aiSummary.averageSeverity)}`}>
                <Gauge className="h-3 w-3 inline mr-1" />
                {Math.round(aiSummary.averageSeverity)}/100
              </p>
            </div>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Photos</p>
          <p className="font-medium text-text">{photoCount}</p>
        </div>
      </div>
    </div>
  )
}
