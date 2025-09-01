import { useState } from 'react'
import { Plus, Check, AlertCircle, Settings } from 'lucide-react'
import IntegrationCard from '../components/IntegrationCard'

const availableIntegrations = [
  {
    id: 'xactimate',
    name: 'Xactimate',
    description: 'Industry-leading estimating software',
    logo: '/api/placeholder/40/40',
    connected: true,
    status: 'active'
  },
  {
    id: 'symbility',
    name: 'Symbility',
    description: 'Cloud-based claims management platform',
    logo: '/api/placeholder/40/40',
    connected: false,
    status: 'available'
  },
  {
    id: 'verisk',
    name: 'Verisk Claims',
    description: 'Comprehensive claims processing suite',
    logo: '/api/placeholder/40/40',
    connected: true,
    status: 'active'
  },
  {
    id: 'guidewire',
    name: 'Guidewire ClaimCenter',
    description: 'End-to-end claims management system',
    logo: '/api/placeholder/40/40',
    connected: false,
    status: 'available'
  }
]

export default function Integrations() {
  const [integrations, setIntegrations] = useState(availableIntegrations)
  const [showSetup, setShowSetup] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState(null)

  const handleConnect = (integration) => {
    setSelectedIntegration(integration)
    setShowSetup(true)
  }

  const handleDisconnect = (integrationId) => {
    setIntegrations(prev => 
      prev.map(int => 
        int.id === integrationId 
          ? { ...int, connected: false, status: 'available' }
          : int
      )
    )
  }

  const connectedCount = integrations.filter(int => int.connected).length

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Integrations</h1>
        <p className="text-gray-600">Connect ClaimSnap AI with your existing claims management systems</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Connected</p>
              <p className="text-2xl font-bold text-text">{connectedCount}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plus className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold text-text">{integrations.length - connectedCount}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Settings className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Platforms</p>
              <p className="text-2xl font-bold text-text">{integrations.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map(integration => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            onConnect={() => handleConnect(integration)}
            onDisconnect={() => handleDisconnect(integration.id)}
          />
        ))}
      </div>

      {/* Setup Modal */}
      {showSetup && selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-text mb-4">
              Connect to {selectedIntegration.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Endpoint
                </label>
                <input
                  type="url"
                  placeholder="https://api.example.com"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  placeholder="Enter your API key"
                  className="input-field"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    // Simulate connection
                    setIntegrations(prev => 
                      prev.map(int => 
                        int.id === selectedIntegration.id 
                          ? { ...int, connected: true, status: 'active' }
                          : int
                      )
                    )
                    setShowSetup(false)
                  }}
                  className="btn-primary flex-1"
                >
                  Connect
                </button>
                <button
                  onClick={() => setShowSetup(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}