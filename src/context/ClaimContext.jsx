import { createContext, useContext, useState } from 'react'
import { mockClaims, mockPhotos } from '../utils/mockData'

const ClaimContext = createContext()

export function ClaimProvider({ children }) {
  const [claims, setClaims] = useState(mockClaims)
  const [photos, setPhotos] = useState(mockPhotos)
  const [processingFiles, setProcessingFiles] = useState([])

  const addClaim = (claimData) => {
    const newClaim = {
      id: Date.now().toString(),
      ...claimData,
      status: 'active',
      createdAt: new Date().toISOString(),
    }
    setClaims(prev => [newClaim, ...prev])
    return newClaim
  }

  const addPhotos = (claimId, photoFiles) => {
    const newPhotos = photoFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      claimId,
      filename: file.name,
      fileUrl: URL.createObjectURL(file),
      tags: [],
      damageType: 'pending',
      location: 'unknown',
      qualityScore: Math.random() * 100,
      isDuplicate: Math.random() < 0.1,
      uploadedAt: new Date().toISOString(),
    }))
    
    setPhotos(prev => [...prev, ...newPhotos])
    return newPhotos
  }

  const simulateProcessing = async (files) => {
    setProcessingFiles(files.map(f => f.name))
    
    // Simulate AI processing delay
    for (let i = 0; i < files.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProcessingFiles(prev => prev.filter(name => name !== files[i].name))
    }
  }

  const value = {
    claims,
    photos,
    processingFiles,
    addClaim,
    addPhotos,
    simulateProcessing,
  }

  return (
    <ClaimContext.Provider value={value}>
      {children}
    </ClaimContext.Provider>
  )
}

export function useClaims() {
  const context = useContext(ClaimContext)
  if (!context) {
    throw new Error('useClaims must be used within ClaimProvider')
  }
  return context
}