import { createContext, useContext, useState, useCallback } from 'react'
import { mockClaims, mockPhotos, damageTypes, commonTags } from '../utils/mockData'
import { useToast } from '../App'

const ClaimContext = createContext()

export function ClaimProvider({ children }) {
  const [claims, setClaims] = useState(mockClaims)
  const [photos, setPhotos] = useState(mockPhotos)
  const [processingFiles, setProcessingFiles] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { addToast } = useToast ? useToast() : { addToast: () => {} }

  // Add a new claim
  const addClaim = useCallback((claimData) => {
    try {
      const newClaim = {
        id: Date.now().toString(),
        userId: '1', // In a real app, this would come from auth
        ...claimData,
        status: 'active',
        createdAt: new Date().toISOString(),
        photoCount: 0
      }
      setClaims(prev => [newClaim, ...prev])
      addToast('Claim created successfully', 'success')
      return newClaim
    } catch (error) {
      console.error('Error creating claim:', error)
      addToast('Failed to create claim', 'error')
      throw error
    }
  }, [addToast])

  // Add photos to a claim
  const addPhotos = useCallback((claimId, photoFiles) => {
    try {
      // Create new photo objects
      const newPhotos = photoFiles.map((file, index) => {
        // In a real app, these would be determined by AI
        const randomDamageType = damageTypes[Math.floor(Math.random() * damageTypes.length)]
        const randomLocation = commonTags.slice(0, 7)[Math.floor(Math.random() * 7)]
        const randomTags = []
        
        // Add 1-3 random tags
        const tagCount = Math.floor(Math.random() * 3) + 1
        for (let i = 0; i < tagCount; i++) {
          const randomTag = commonTags[Math.floor(Math.random() * commonTags.length)]
          if (!randomTags.includes(randomTag)) {
            randomTags.push(randomTag)
          }
        }
        
        return {
          id: `${Date.now()}-${index}`,
          claimId,
          filename: file.name,
          fileUrl: URL.createObjectURL(file),
          tags: randomTags,
          damageType: randomDamageType,
          location: randomLocation,
          qualityScore: Math.floor(Math.random() * 30) + 70, // 70-100
          isDuplicate: Math.random() < 0.1,
          uploadedAt: new Date().toISOString(),
        }
      })
      
      // Update photos state
      setPhotos(prev => [...newPhotos, ...prev])
      
      // Update claim's photo count
      setClaims(prev => prev.map(claim => 
        claim.id === claimId 
          ? { ...claim, photoCount: (claim.photoCount || 0) + newPhotos.length }
          : claim
      ))
      
      addToast(`${newPhotos.length} photos processed successfully`, 'success')
      return newPhotos
    } catch (error) {
      console.error('Error adding photos:', error)
      addToast('Failed to process photos', 'error')
      throw error
    }
  }, [addToast])

  // Simulate AI processing of photos
  const simulateProcessing = useCallback(async (files) => {
    setIsLoading(true)
    setProcessingFiles(files.map(f => f.name))
    
    try {
      // Simulate AI processing delay with variable times
      for (let i = 0; i < files.length; i++) {
        // Random processing time between 500ms and 1500ms
        const processingTime = Math.random() * 1000 + 500
        await new Promise(resolve => setTimeout(resolve, processingTime))
        setProcessingFiles(prev => prev.filter(name => name !== files[i].name))
      }
    } catch (error) {
      console.error('Error processing files:', error)
      addToast('An error occurred during processing', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [addToast])
  
  // Update a claim
  const updateClaim = useCallback((claimId, updates) => {
    try {
      setClaims(prev => prev.map(claim => 
        claim.id === claimId ? { ...claim, ...updates } : claim
      ))
      addToast('Claim updated successfully', 'success')
    } catch (error) {
      console.error('Error updating claim:', error)
      addToast('Failed to update claim', 'error')
      throw error
    }
  }, [addToast])
  
  // Delete a claim
  const deleteClaim = useCallback((claimId) => {
    try {
      setClaims(prev => prev.filter(claim => claim.id !== claimId))
      // Also delete associated photos
      setPhotos(prev => prev.filter(photo => photo.claimId !== claimId))
      addToast('Claim deleted successfully', 'info')
    } catch (error) {
      console.error('Error deleting claim:', error)
      addToast('Failed to delete claim', 'error')
      throw error
    }
  }, [addToast])

  const value = {
    claims,
    photos,
    processingFiles,
    isLoading,
    addClaim,
    addPhotos,
    simulateProcessing,
    updateClaim,
    deleteClaim
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
