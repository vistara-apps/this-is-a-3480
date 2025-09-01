import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FileUploadZone from '../components/FileUploadZone'
import ClaimForm from '../components/ClaimForm'
import ProcessingProgress from '../components/ProcessingProgress'
import { useClaims } from '../context/ClaimContext'

export default function Upload() {
  const navigate = useNavigate()
  const { addClaim, addPhotos, processPhotosWithAI, processingFiles } = useClaims()
  const [selectedFiles, setSelectedFiles] = useState([])
  const [currentClaim, setCurrentClaim] = useState(null)
  const [step, setStep] = useState('claim') // claim, upload, processing, complete
  const [processingStatus, setProcessingStatus] = useState({
    total: 0,
    completed: 0,
    currentFile: null
  })

  const handleClaimSubmit = (claimData) => {
    const newClaim = addClaim(claimData)
    setCurrentClaim(newClaim)
    setStep('upload')
  }

  const handleFilesSelected = async (files) => {
    setSelectedFiles(files)
    setStep('processing')
    setProcessingStatus({
      total: files.length,
      completed: 0,
      currentFile: files[0]?.name || null
    })
    
    // Process photos with AI
    const aiResults = await processPhotosWithAI(files)
    
    // Add photos to claim with AI analysis results
    addPhotos(currentClaim.id, files, aiResults)
    
    setStep('complete')
  }

  const handleComplete = () => {
    navigate('/claims')
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Upload Property Damage Photos</h1>
        <p className="text-gray-600">Create a new claim and upload photos for AI-powered analysis</p>
      </div>

      {step === 'claim' && (
        <div className="card">
          <h2 className="text-xl font-semibold text-text mb-6">Claim Information</h2>
          <ClaimForm onSubmit={handleClaimSubmit} />
        </div>
      )}

      {step === 'upload' && (
        <div className="card">
          <h2 className="text-xl font-semibold text-text mb-6">
            Upload Photos for Claim: {currentClaim?.claimNumber}
          </h2>
          <FileUploadZone onFilesSelected={handleFilesSelected} />
        </div>
      )}

      {step === 'processing' && (
        <div className="card">
          <h2 className="text-xl font-semibold text-text mb-6">Processing Photos</h2>
          <ProcessingProgress 
            files={selectedFiles} 
            processingFiles={processingFiles}
          />
        </div>
      )}

      {step === 'complete' && (
        <div className="card text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-text mb-4">Processing Complete!</h2>
          <p className="text-gray-600 mb-6">
            {selectedFiles.length} photos have been processed and organized for claim {currentClaim?.claimNumber}
          </p>
          <button 
            onClick={handleComplete}
            className="btn-primary"
          >
            View Claim Details
          </button>
        </div>
      )}
    </div>
  )
}
