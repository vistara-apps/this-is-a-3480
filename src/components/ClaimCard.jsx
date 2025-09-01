import { formatDistanceToNow } from 'date-fns'
import { Eye, Calendar, MapPin } from 'lucide-react'

export default function ClaimCard({ claim, photoCount, onViewPhotos }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'review': return 'bg-orange-100 text-orange-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-text mb-1">{claim.claimNumber}</h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(claim.status)}`}>
            {claim.status}
          </span>
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
          <p className="font-medium text-text">{claim.damageType}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Photos</p>
          <p className="font-medium text-text">{photoCount}</p>
        </div>
      </div>
    </div>
  )
}