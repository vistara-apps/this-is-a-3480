import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Upload, FileText, CheckCircle, AlertTriangle, BarChart3, 
  TrendingUp, Camera, ArrowRight, PieChart, LineChart
} from 'lucide-react'
import { useClaims } from '../context/ClaimContext'
import StatsCard from '../components/StatsCard'
import RecentActivity from '../components/RecentActivity'
import PhotoGrid from '../components/PhotoGrid'
import DamageChart from '../components/DamageChart'
import ClaimTrendChart from '../components/ClaimTrendChart'
import { useToast } from '../App'
import LoadingIndicator from '../components/LoadingIndicator'

export default function Dashboard() {
  const { claims, photos, isLoading } = useClaims()
  const { addToast } = useToast()
  const [damageChartData, setDamageChartData] = useState([])
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  const stats = {
    totalClaims: claims.length,
    photosProcessed: photos.length,
    activeClaims: claims.filter(c => c.status === 'active').length,
    completedClaims: claims.filter(c => c.status === 'completed').length,
  }

  const recentPhotos = photos.slice(0, 8)
  
  // Prepare data for damage chart
  useEffect(() => {
    if (claims.length > 0) {
      // Count claims by damage type
      const damageTypes = {}
      
      claims.forEach(claim => {
        if (!damageTypes[claim.damageType]) {
          damageTypes[claim.damageType] = 0
        }
        damageTypes[claim.damageType]++
      })
      
      // Convert to array format for chart
      const chartData = Object.entries(damageTypes).map(([name, value]) => ({
        name,
        value
      }))
      
      setDamageChartData(chartData)
      setIsDataLoaded(true)
    }
  }, [claims])
  
  // Demo function to show toast notifications
  const showWelcomeToast = () => {
    addToast('Welcome to ClaimSnap AI Dashboard!', 'info')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">Dashboard</h1>
        <p className="text-gray-600">Streamline your property damage claims with AI-powered photo analysis</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-8">
        <Link 
          to="/upload" 
          className="card hover:shadow-lg transition-shadow group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Upload Photos"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-text">Upload Photos</h3>
              <p className="text-gray-600">Process new damage photos with AI</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" aria-hidden="true" />
          </div>
        </Link>

        <Link 
          to="/claims" 
          className="card hover:shadow-lg transition-shadow group focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          aria-label="Manage Claims"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-text">Manage Claims</h3>
              <p className="text-gray-600">View and organize existing claims</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-accent transition-colors" aria-hidden="true" />
          </div>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <StatsCard
          title="Total Claims"
          value={stats.totalClaims}
          icon={FileText}
          color="bg-blue-500"
        />
        <StatsCard
          title="Photos Processed"
          value={stats.photosProcessed}
          icon={Camera}
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
      
      {/* Charts Section */}
      {isDataLoaded ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {/* Damage Distribution Chart */}
          <div className="card">
            <DamageChart data={damageChartData} title="Damage Type Distribution" />
          </div>
          
          {/* Claims Trend Chart */}
          <div className="card">
            <ClaimTrendChart claims={claims} title="Claims Activity" />
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <LoadingIndicator text="Loading charts..." />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Recent Photos */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-text">Recent Photos</h2>
              <Link 
                to="/claims" 
                className="text-primary hover:underline text-sm flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-primary focus:rounded-md px-2 py-1"
                aria-label="View all photos"
              >
                <span>View all</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            {isLoading ? (
              <LoadingIndicator size="small" text="Loading photos..." />
            ) : recentPhotos.length > 0 ? (
              <PhotoGrid photos={recentPhotos} />
            ) : (
              <div className="text-center py-8">
                <Camera className="h-12 w-12 text-gray-300 mx-auto mb-3" aria-hidden="true" />
                <p className="text-gray-500">No photos uploaded yet</p>
                <Link 
                  to="/upload" 
                  className="mt-3 inline-flex items-center text-primary hover:underline"
                >
                  Upload your first photos
                </Link>
              </div>
            )}
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
