import { useState } from 'react'
import { Search, Filter, Eye, Download } from 'lucide-react'
import { useClaims } from '../context/ClaimContext'
import ClaimCard from '../components/ClaimCard'
import PhotoModal from '../components/PhotoModal'

export default function Claims() {
  const { claims, photos } = useClaims()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedClaim, setSelectedClaim] = useState(null)
  const [showPhotoModal, setShowPhotoModal] = useState(false)

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || claim.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const handleViewPhotos = (claim) => {
    setSelectedClaim(claim)
    setShowPhotoModal(true)
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Claims Management</h1>
        <p className="text-gray-600">Manage and review your property damage claims</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search claims..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field w-auto"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="review">Under Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Claims Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClaims.map(claim => (
          <ClaimCard
            key={claim.id}
            claim={claim}
            photoCount={photos.filter(p => p.claimId === claim.id).length}
            onViewPhotos={() => handleViewPhotos(claim)}
          />
        ))}
      </div>

      {filteredClaims.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No claims found matching your criteria.</p>
        </div>
      )}

      {/* Photo Modal */}
      {showPhotoModal && selectedClaim && (
        <PhotoModal
          claim={selectedClaim}
          photos={photos.filter(p => p.claimId === selectedClaim.id)}
          onClose={() => setShowPhotoModal(false)}
        />
      )}
    </div>
  )
}