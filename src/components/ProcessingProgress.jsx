import { CheckCircle, Clock, Loader } from 'lucide-react'

export default function ProcessingProgress({ files, processingFiles }) {
  const getFileStatus = (filename) => {
    if (processingFiles.includes(filename)) return 'processing'
    return 'completed'
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Processing Progress</span>
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

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {files.map((file, index) => {
          const status = getFileStatus(file.name)
          return (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                {status === 'processing' ? (
                  <Loader className="h-5 w-5 text-primary animate-spin" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {status === 'processing' ? 'Analyzing damage...' : 'Analysis complete'}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}