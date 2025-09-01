import { useState } from 'react'
import { Search, Filter, Eye, Download, Brain } from 'lucide-react'
import { useClaims } from '../context/ClaimContext'
import ClaimCard from '../components/ClaimCard'
import PhotoModal from '../components/PhotoModal'
import AIAnalysisSummary from '../components/AIAnalysisSummary'

export default function Claims() {
  const { claims, photos, summaryReports } = useClaims()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedClaim, setSelectedClaim] = useState(null)
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [showAIAnalysis, setShowAIAnalysis] = useState(false)

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

  const handleToggleAIAnalysis = (claim) => {
    if (selectedClaim?.id === claim.id && showAIAnalysis) {
      // If already showing analysis for this claim, close it
      setShowAIAnalysis(false)
      setSelectedClaim(null)
    } else {
      // Show analysis for this claim
      setSelectedClaim(claim)
      setShowAIAnalysis(true)
    }
  }

  // Check if a claim has AI analysis
  const hasAIAnalysis = (claimId) => {
    return summaryReports && summaryReports[claimId];
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Claims Management</h1>
        <p className="text-gray-600">Manage and review your property damage claims with AI-powered analysis</p>
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

      {/* AI Analysis Summary (if selected) */}
      {showAIAnalysis && selectedClaim && hasAIAnalysis(selectedClaim.id) && (
        <div className="mb-6">
          <AIAnalysisSummary 
            report={summaryReports[selectedClaim.id]} 
            claimId={selectedClaim.id} 
          />
          <div className="mt-4 text-center">
            <button 
              onClick={() => setShowAIAnalysis(false)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Hide AI Analysis
            </button>
          </div>
        </div>
      )}

      {/* Claims Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClaims.map(claim => {
          const claimPhotos = photos.filter(p => p.claimId === claim.id);
          const hasAnalysis = hasAIAnalysis(claim.id);
          
          return (
            <div key={claim.id} className="flex flex-col">
              <ClaimCard
                claim={claim}
                photoCount={claimPhotos.length}
                onViewPhotos={() => handleViewPhotos(claim)}
                aiSummary={hasAnalysis ? summaryReports[claim.id] : null}
              />
              
              {/* AI Analysis Button (if available) */}
              {hasAnalysis && (
                <button
                  onClick={() => handleToggleAIAnalysis(claim)}
                  className="mt-2 text-xs flex items-center justify-center py-1 px-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                >
                  <Brain className="h-3 w-3 mr-1" />
                  {selectedClaim?.id === claim.id && showAIAnalysis 
                    ? 'Hide AI Analysis' 
                    : 'View AI Analysis'}
                </button>
              )}
            </div>
          );
        })}
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
