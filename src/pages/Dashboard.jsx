import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Upload, FileText, CheckCircle, AlertTriangle, BarChart3, TrendingUp } from 'lucide-react'
import { useClaims } from '../context/ClaimContext'
import StatsCard from '../components/StatsCard'
import RecentActivity from '../components/RecentActivity'
import PhotoGrid from '../components/PhotoGrid'

export default function Dashboard() {
  const { claims, photos } = useClaims()

  const stats = {
    totalClaims: claims.length,
    photosProcessed: photos.length,
    activeClaims: claims.filter(c => c.status === 'active').length,
    completedClaims: claims.filter(c => c.status === 'completed').length,
  }

  const recentPhotos = photos.slice(0, 8)

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Dashboard</h1>
        <p className="text-gray-600">Streamline your property damage claims with AI-powered photo analysis</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link to="/upload" className="card hover:shadow-lg transition-shadow group">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text">Upload Photos</h3>
              <p className="text-gray-600">Process new damage photos with AI</p>
            </div>
          </div>
        </Link>

        <Link to="/claims" className="card hover:shadow-lg transition-shadow group">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text">Manage Claims</h3>
              <p className="text-gray-600">View and organize existing claims</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Claims"
          value={stats.totalClaims}
          icon={FileText}
          color="bg-blue-500"
        />
        <StatsCard
          title="Photos Processed"
          value={stats.photosProcessed}
          icon={BarChart3}
          color="bg-green-500"
        />
        <StatsCard
          title="Active Claims"
          value={stats.activeClaims}
          icon={AlertTriangle}
          color="bg-orange-500"
        />
        <StatsCard
          title="Completed"
          value={stats.completedClaims}
          icon={CheckCircle}
          color="bg-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Photos */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text">Recent Photos</h2>
              <Link to="/claims" className="text-primary hover:underline text-sm">
                View all
              </Link>
            </div>
            <PhotoGrid photos={recentPhotos} />
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <RecentActivity claims={claims} />
        </div>
      </div>
    </div>
  )
}