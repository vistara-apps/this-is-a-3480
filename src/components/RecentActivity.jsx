import { formatDistanceToNow } from 'date-fns'

export default function RecentActivity({ claims }) {
  const recentClaims = claims
    .sort((a, b) => new Date(b.dateReported) - new Date(a.dateReported))
    .slice(0, 5)

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'review': return 'bg-orange-100 text-orange-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-text mb-6">Recent Activity</h2>
      <div className="space-y-4">
        {recentClaims.map(claim => (
          <div key={claim.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text">{claim.claimNumber}</p>
              <p className="text-sm text-gray-600">
                {formatDistanceToNow(new Date(claim.dateReported), { addSuffix: true })}
              </p>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(claim.status)}`}>
              {claim.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}