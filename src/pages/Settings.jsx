import { useState } from 'react'
import { User, Bell, Shield, CreditCard, Database } from 'lucide-react'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'data', name: 'Data Management', icon: Database },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <nav className="space-y-2">
              {tabs.map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold text-text mb-6">Profile Settings</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue="adjuster@insurance.com"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        defaultValue="SafeGuard Insurance"
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subscription Tier
                    </label>
                    <select className="input-field">
                      <option>Professional - $99/month</option>
                      <option>Enterprise - $299/month</option>
                    </select>
                  </div>
                  <button className="btn-primary">Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold text-text mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-text">Processing Complete</h3>
                      <p className="text-sm text-gray-600">Get notified when photo processing is finished</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-text">Quality Issues</h3>
                      <p className="text-sm text-gray-600">Alert when low quality or duplicate photos are detected</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-text">Weekly Reports</h3>
                      <p className="text-sm text-gray-600">Receive weekly processing summaries</p>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold text-text mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-text mb-2">Change Password</h3>
                    <div className="space-y-4">
                      <input
                        type="password"
                        placeholder="Current password"
                        className="input-field"
                      />
                      <input
                        type="password"
                        placeholder="New password"
                        className="input-field"
                      />
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-text mb-2">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      <button className="btn-secondary">Enable 2FA</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div>
                <h2 className="text-xl font-semibold text-text mb-6">Billing Information</h2>
                <div className="space-y-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-medium text-green-800 mb-1">Professional Plan</h3>
                    <p className="text-green-600">$99/month - Next billing: March 1, 2024</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-text mb-4">Payment Method</h3>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span>•••• •••• •••• 4242</span>
                        <button className="text-primary hover:underline">Update</button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-text mb-2">Usage This Month</h3>
                    <div className="text-sm text-gray-600">
                      <p>Photos processed: 1,247 / 5,000</p>
                      <p>API calls: 3,891 / 10,000</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div>
                <h2 className="text-xl font-semibold text-text mb-6">Data Management</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-text mb-2">Data Retention</h3>
                    <select className="input-field">
                      <option>Keep data for 1 year</option>
                      <option>Keep data for 2 years</option>
                      <option>Keep data permanently</option>
                    </select>
                  </div>
                  <div>
                    <h3 className="font-medium text-text mb-2">Export Data</h3>
                    <p className="text-sm text-gray-600 mb-4">Download all your claims and photo data</p>
                    <button className="btn-secondary">Export All Data</button>
                  </div>
                  <div className="border-t pt-6">
                    <h3 className="font-medium text-red-600 mb-2">Danger Zone</h3>
                    <p className="text-sm text-gray-600 mb-4">Permanently delete your account and all associated data</p>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}