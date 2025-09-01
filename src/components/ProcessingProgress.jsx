import { CheckCircle, Clock, Loader, AlertTriangle, Image, Tag, MapPin } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function ProcessingProgress({ files, processingFiles }) {
  const [progress, setProgress] = useState(0)
  const [currentStage, setCurrentStage] = useState('uploading') // uploading, analyzing, categorizing, complete
  const [stageMessages, setStageMessages] = useState({
    uploading: 'Uploading photos to secure server...',
    analyzing: 'Analyzing images with AI...',
    categorizing: 'Categorizing and tagging damage types...',
    complete: 'Processing complete!'
  })
  
  // Calculate overall progress
  const completedCount = files.length - processingFiles.length
  const percentComplete = Math.round((completedCount / files.length) * 100)
  
  // Update progress and stages based on completion percentage
  useEffect(() => {
    setProgress(percentComplete)
    
    // Update processing stage based on progress
    if (percentComplete === 100) {
      setCurrentStage('complete')
    } else if (percentComplete > 70) {
      setCurrentStage('categorizing')
    } else if (percentComplete > 30) {
      setCurrentStage('analyzing')
    } else {
      setCurrentStage('uploading')
    }
  }, [percentComplete])
  
  const getFileStatus = (filename) => {
    if (processingFiles.includes(filename)) return 'processing'
    return 'completed'
  }
  
  // Generate random processing details for completed files
  const getProcessingDetails = (filename) => {
    // This would come from the AI in a real app
    const damageTypes = ['water', 'fire', 'storm', 'structural', 'electrical']
    const locations = ['kitchen', 'bathroom', 'living room', 'exterior', 'roof']
    const tags = ['ceiling', 'wall', 'floor', 'window', 'door', 'appliance']
    
    return {
      damageType: damageTypes[Math.floor(Math.random() * damageTypes.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      tags: [
        tags[Math.floor(Math.random() * tags.length)],
        tags[Math.floor(Math.random() * tags.length)]
      ],
      qualityScore: Math.floor(Math.random() * 30) + 70 // 70-100
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress header */}
      <div className="text-center mb-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-primary mb-4">
          {currentStage === 'complete' ? (
            <CheckCircle className="h-8 w-8" aria-hidden="true" />
          ) : (
            <Loader className="h-8 w-8 animate-spin" aria-hidden="true" />
          )}
        </div>
        <h3 className="text-xl font-semibold text-text mb-1">
          {currentStage === 'complete' ? 'Processing Complete!' : 'Processing Photos...'}
        </h3>
        <p className="text-gray-600">{stageMessages[currentStage]}</p>
      </div>
      
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Overall Progress</span>
          <span className="font-medium">{completedCount} / {files.length} complete ({percentComplete}%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="bg-primary h-3 rounded-full transition-all duration-500 flex items-center justify-end"
            style={{
              width: `${percentComplete}%`
            }}
          >
            {percentComplete > 15 && (
              <span className="text-white text-xs mr-2 font-medium">{percentComplete}%</span>
            )}
          </div>
        </div>
        
        {/* Processing stages */}
        <div className="flex justify-between mt-4 relative">
          <div className="absolute top-3 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
          
          <div className="flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
              progress >= 0 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
            }`}>
              <CheckCircle className="h-3 w-3" />
            </div>
            <span className="text-xs text-gray-600">Upload</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
              progress >= 33 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
            }`}>
              <CheckCircle className="h-3 w-3" />
            </div>
            <span className="text-xs text-gray-600">Analyze</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
              progress >= 66 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
            }`}>
              <CheckCircle className="h-3 w-3" />
            </div>
            <span className="text-xs text-gray-600">Categorize</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
              progress === 100 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
            }`}>
              <CheckCircle className="h-3 w-3" />
            </div>
            <span className="text-xs text-gray-600">Complete</span>
          </div>
        </div>
      </div>

      {/* File list */}
      <div className="space-y-3 max-h-96 overflow-y-auto rounded-lg border border-gray-200 p-1">
        {files.map((file, index) => {
          const status = getFileStatus(file.name)
          const details = status === 'completed' ? getProcessingDetails(file.name) : null
          
          return (
            <div 
              key={index} 
              className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                status === 'completed' 
                  ? 'bg-green-50 border border-green-100' 
                  : 'bg-gray-50 border border-gray-100'
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                {status === 'processing' ? (
                  <Loader className="h-5 w-5 text-primary animate-spin" aria-hidden="true" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500" aria-hidden="true" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-text truncate">{file.name}</p>
                  {status === 'completed' && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {details.qualityScore}% quality
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 mb-1">
                  {status === 'processing' ? 'Analyzing damage...' : 'Analysis complete'}
                </p>
                
                {status === 'completed' && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    <div className="flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                      <Tag className="h-3 w-3 mr-1" aria-hidden="true" />
                      <span>{details.damageType}</span>
                    </div>
                    <div className="flex items-center text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
                      <MapPin className="h-3 w-3 mr-1" aria-hidden="true" />
                      <span>{details.location}</span>
                    </div>
                    {details.tags.map((tag, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
