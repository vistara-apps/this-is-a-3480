import { Check, Plus, Settings } from 'lucide-react'

export default function IntegrationCard({ integration, onConnect, onDisconnect }) {
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold text-gray-600">
              {integration.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text">{integration.name}</h3>
            <p className="text-sm text-gray-600">{integration.description}</p>
          </div>
        </div>
        {integration.connected ? (
          <div className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-green-500" />
            <span className="text-sm text-green-600 font-medium">Connected</span>
          </div>
        ) : (
          <span className="text-sm text-gray-500">Available</span>
        )}
      </div>

      <div className="flex space-x-2">
        {integration.connected ? (
          <>
            <button className="btn-secondary flex-1 flex items-center justify-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Configure</span>
            </button>
            <button
              onClick={onDisconnect}
              className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              Disconnect
            </button>
          </>
        ) : (
          <button
            onClick={onConnect}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Connect</span>
          </button>
        )}
      </div>
    </div>
  )
}