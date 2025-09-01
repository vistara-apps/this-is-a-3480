import { CheckCircle, AlertTriangle, Loader, Brain, Camera, Gauge } from 'lucide-react'

export default function ProcessingProgress({ files, processingFiles }) {
  const getFileStatus = (filename) => {
    if (processingFiles.includes(filename)) return 'processing'
    return 'completed'
  }

  // Calculate the current AI processing stage for a file
  const getProcessingStage = (filename) => {
    if (!processingFiles.includes(filename)) return 'complete';
    
    // Simulate different AI processing stages
    const fileIndex = files.findIndex(f => f.name === filename);
    const completedPercentage = fileIndex / files.length;
    
    if (completedPercentage < 0.3) return 'image-analysis';
    if (completedPercentage < 0.6) return 'damage-detection';
    return 'severity-scoring';
  }

  // Get stage-specific message
  const getStageMessage = (stage) => {
    switch (stage) {
      case 'image-analysis':
        return 'Analyzing image quality and content...';
      case 'damage-detection':
        return 'Detecting and classifying damage types...';
      case 'severity-scoring':
        return 'Calculating severity scores and anomalies...';
      case 'complete':
        return 'AI analysis complete';
      default:
        return 'Processing...';
    }
  }

  // Get stage-specific icon
  const getStageIcon = (stage) => {
    switch (stage) {
      case 'image-analysis':
        return <Camera className="h-5 w-5 text-blue-500" />;
      case 'damage-detection':
        return <Brain className="h-5 w-5 text-purple-500" />;
      case 'severity-scoring':
        return <Gauge className="h-5 w-5 text-orange-500" />;
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Loader className="h-5 w-5 text-primary animate-spin" />;
    }
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>AI Processing Progress</span>
          <span>{files.length - processingFiles.length} / {files.length} complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{
              width: `${((files.length - processingFiles.length) / files.length) * 100}%`
            }}
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-start">
          <Brain className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">AI Processing Information</h3>
            <p className="text-xs text-blue-600 mt-1">
              Our advanced AI is analyzing your photos using computer vision to detect damage types, 
              assess severity, and identify potential anomalies. This process includes image quality 
              assessment, damage classification, and severity scoring based on insurance-specific models.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {files.map((file, index) => {
          const status = getFileStatus(file.name);
          const stage = getProcessingStage(file.name);
          const message = getStageMessage(stage);
          const icon = getStageIcon(stage);
          
          return (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{message}</p>
                
                {status === 'processing' && (
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                    <div 
                      className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                      style={{
                        width: stage === 'image-analysis' ? '30%' : 
                               stage === 'damage-detection' ? '60%' : 
                               stage === 'severity-scoring' ? '90%' : '100%'
                      }}
                    />
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
