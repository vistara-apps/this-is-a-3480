import { formatDistanceToNow, format } from 'date-fns'
import { Link } from 'react-router-dom'
import { Clock, FileText, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react'

export default function RecentActivity({ claims }) {
  const recentClaims = claims
    .sort((a, b) => new Date(b.dateReported) - new Date(a.dateReported))
    .slice(0, 5)

  const getStatusInfo = (status) => {
    switch (status) {
      case 'active': 
        return { 
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <AlertTriangle className="h-3 w-3" aria-hidden="true" />,
          dotColor: 'bg-blue-500'
        }
      case 'review': 
        return { 
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: <Clock className="h-3 w-3" aria-hidden="true" />,
          dotColor: 'bg-orange-500'
        }
      case 'completed': 
        return { 
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="h-3 w-3" aria-hidden="true" />,
          dotColor: 'bg-green-500'
        }
      default: 
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <FileText className="h-3 w-3" aria-hidden="true" />,
          dotColor: 'bg-gray-500'
        }
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-text">Recent Activity</h2>
        <Link 
          to="/claims" 
          className="text-primary hover:underline text-sm flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-primary focus:rounded-md px-2 py-1"
          aria-label="View all claims"
        >
          <span>View all</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      
      {recentClaims.length > 0 ? (
        <div className="space-y-4">
          {recentClaims.map(claim => {
            const { color, icon, dotColor } = getStatusInfo(claim.status)
            const formattedDate = format(new Date(claim.dateReported), 'MMM d, yyyy')
            const timeAgo = formatDistanceToNow(new Date(claim.dateReported), { addSuffix: true })
            
            return (
              <div 
                key={claim.id} 
                className="p-3 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${dotColor} mr-2`} aria-hidden="true"></div>
                    <p className="font-medium text-text">{claim.claimNumber}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border flex items-center space-x-1 ${color}`}>
                    {icon}
                    <span>{claim.status}</span>
                  </span>
                </div>
                
                <p className="text-sm text-gray-700 mb-1 line-clamp-1">{claim.propertyAddress}</p>
                
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span title={formattedDate}>{timeAgo}</span>
                  <span>{claim.damageType}</span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" aria-hidden="true" />
          <p className="text-gray-500">No claims yet</p>
          <Link 
            to="/upload" 
            className="mt-3 inline-flex items-center text-primary hover:underline"
          >
            Create your first claim
          </Link>
        </div>
      )}
    </div>
  )
}
