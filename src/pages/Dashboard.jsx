import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Upload, FileText, CheckCircle, AlertTriangle, BarChart3, TrendingUp, Brain, Gauge, AlertCircle } from 'lucide-react'
import { useClaims } from '../context/ClaimContext'
import StatsCard from '../components/StatsCard'
import RecentActivity from '../components/RecentActivity'
import PhotoGrid from '../components/PhotoGrid'
import DamageChart from '../components/DamageChart'

export default function Dashboard() {
  const { claims, photos, summaryReports } = useClaims()

  // Calculate AI analysis statistics
  const calculateAIStats = () => {
    if (!summaryReports || Object.keys(summaryReports).length === 0) {
      return {
        photosAnalyzed: 0,
        highSeverityCount: 0,
        anomalyCount: 0,
        damageTypeCounts: {},
        severityCounts: { low: 0, medium: 0, high: 0 },
        locationCounts: {}
      };
    }

    // Combine all summary reports
    let photosAnalyzed = 0;
    let highSeverityCount = 0;
    let anomalyCount = 0;
    const damageTypeCounts = {};
    const severityCounts = { low: 0, medium: 0, high: 0 };
    const locationCounts = {};

    Object.values(summaryReports).forEach(report => {
      photosAnalyzed += report.totalImages || 0;
      highSeverityCount += report.highSeverityCount || 0;
      anomalyCount += report.anomalyCount || 0;

      // Aggregate damage types
      if (report.damageTypeCounts) {
        Object.entries(report.damageTypeCounts).forEach(([type, count]) => {
          damageTypeCounts[type] = (damageTypeCounts[type] || 0) + count;
        });
      }

      // Aggregate locations
      if (report.locationCounts) {
        Object.entries(report.locationCounts).forEach(([location, count]) => {
          locationCounts[location] = (locationCounts[location] || 0) + count;
        });
      }

      // Calculate severity counts based on average severity
      if (report.averageSeverity) {
        const avgSeverity = report.averageSeverity;
        if (avgSeverity < 40) {
          severityCounts.low += report.totalImages;
        } else if (avgSeverity < 75) {
          severityCounts.medium += report.totalImages;
        } else {
          severityCounts.high += report.totalImages;
        }
      }
    });

    return {
      photosAnalyzed,
      highSeverityCount,
      anomalyCount,
      damageTypeCounts,
      severityCounts,
      locationCounts
    };
  };

  const aiStats = calculateAIStats();

  const stats = {
    totalClaims: claims.length,
    photosProcessed: photos.length,
    activeClaims: claims.filter(c => c.status === 'active').length,
    completedClaims: claims.filter(c => c.status === 'completed').length,
    photosAnalyzed: aiStats.photosAnalyzed,
    highSeverityCount: aiStats.highSeverityCount,
    anomalyCount: aiStats.anomalyCount
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

      {/* AI Analysis Section */}
      {aiStats.photosAnalyzed > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Brain className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold text-text">AI Analysis Insights</h2>
          </div>
          
          {/* AI Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="card flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">AI Analyzed</p>
                <p className="text-xl font-semibold">{aiStats.photosAnalyzed} Photos</p>
              </div>
            </div>
            
            <div className="card flex items-center">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <Gauge className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">High Severity</p>
                <p className="text-xl font-semibold">{aiStats.highSeverityCount} Issues</p>
              </div>
            </div>
            
            <div className="card flex items-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Anomalies</p>
                <p className="text-xl font-semibold">{aiStats.anomalyCount} Detected</p>
              </div>
            </div>
          </div>
          
          {/* AI Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DamageChart 
              data={aiStats.damageTypeCounts} 
              type="damage" 
              title="Damage Type Distribution" 
            />
            
            <DamageChart 
              data={aiStats.severityCounts} 
              type="severity" 
              title="Severity Distribution" 
            />
            
            <DamageChart 
              data={aiStats.locationCounts} 
              type="location" 
              title="Top Affected Locations" 
            />
          </div>
        </div>
      )}

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
