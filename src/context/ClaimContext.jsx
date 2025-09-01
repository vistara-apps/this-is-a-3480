import { createContext, useContext, useState } from 'react'
import { mockClaims, mockPhotos } from '../utils/mockData'
import { analyzeImage, batchProcessImages, generateSummaryReport } from '../services/aiService'

const ClaimContext = createContext()

export function ClaimProvider({ children }) {
  const [claims, setClaims] = useState(mockClaims)
  const [photos, setPhotos] = useState(mockPhotos)
  const [processingFiles, setProcessingFiles] = useState([])
  const [analysisResults, setAnalysisResults] = useState({})
  const [summaryReports, setSummaryReports] = useState({})

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

  const addPhotos = (claimId, photoFiles, aiResults = []) => {
    const newPhotos = photoFiles.map((file, index) => {
      // Use AI results if available, otherwise use default values
      const aiResult = aiResults[index] || {};
      
      return {
        id: `${Date.now()}-${index}`,
        claimId,
        filename: file.name,
        fileUrl: URL.createObjectURL(file),
        tags: aiResult.tags || [],
        damageType: aiResult.damageType || 'unknown',
        damageTypeName: aiResult.damageTypeName || 'Unknown',
        location: aiResult.location || 'unknown',
        severityScore: aiResult.severityScore || 0,
        severityLevel: aiResult.severityLevel || 'unknown',
        severityDescription: aiResult.severityDescription || '',
        qualityScore: aiResult.qualityScore || Math.random() * 100,
        isDuplicate: aiResult.isDuplicate || false,
        anomalies: aiResult.anomalies || [],
        confidence: aiResult.confidence || 0,
        uploadedAt: new Date().toISOString(),
        analyzedAt: aiResult.processingTimestamp || null,
      };
    });
    
    setPhotos(prev => [...prev, ...newPhotos]);
    
    // Generate and store summary report if AI results are available
    if (aiResults.length > 0) {
      const report = generateSummaryReport(aiResults);
      setSummaryReports(prev => ({
        ...prev,
        [claimId]: report
      }));
    }
    
    return newPhotos;
  }

  const processPhotosWithAI = async (files) => {
    setProcessingFiles(files.map(f => f.name));
    
    // Process each file with AI
    const results = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        // Analyze the image with AI
        const result = await analyzeImage(file);
        results.push(result);
        
        // Update processing status
        setProcessingFiles(prev => prev.filter(name => name !== file.name));
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        // Remove from processing even if there's an error
        setProcessingFiles(prev => prev.filter(name => name !== file.name));
      }
    }
    
    return results;
  }

  const value = {
    claims,
    photos,
    processingFiles,
    analysisResults,
    summaryReports,
    addClaim,
    addPhotos,
    processPhotosWithAI,
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
