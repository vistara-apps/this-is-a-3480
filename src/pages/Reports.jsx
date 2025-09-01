import { useState } from 'react'
import { Download, FileText, BarChart3, Calendar } from 'lucide-react'
import { useClaims } from '../context/ClaimContext'
import ReportCard from '../components/ReportCard'
import DamageChart from '../components/DamageChart'

export default function Reports() {
  const { claims, photos } = useClaims()
  const [selectedPeriod, setSelectedPeriod] = useState('30')

  const generateReport = (type) => {
    // Simulate report generation
    console.log(`Generating ${type} report...`)
    alert(`${type} report generated successfully!`)
  }

  const damageData = [
    { name: 'Water', value: photos.filter(p => p.damageType === 'water').length },
    { name: 'Fire', value: photos.filter(p => p.damageType === 'fire').length },
    { name: 'Storm', value: photos.filter(p => p.damageType === 'storm').length },
    { name: 'Other', value: photos.filter(p => !['water', 'fire', 'storm'].includes(p.damageType)).length },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Generate comprehensive reports for your claims processing</p>
      </div>

      {/* Report Period Selector */}
      <div className="card mb-6">
        <div className="flex items-center space-x-4">
          <Calendar className="h-5 w-5 text-gray-400" />
          <span className="font-medium text-text">Report Period:</span>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input-field w-auto"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-text mb-4">Damage Type Distribution</h3>
          <DamageChart data={damageData} />
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-text mb-4">Processing Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Photos Processed</span>
              <span className="font-semibold text-text">{photos.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Quality Score</span>
              <span className="font-semibold text-text">
                {Math.round(photos.reduce((sum, p) => sum + p.qualityScore, 0) / photos.length)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Duplicates Detected</span>
              <span className="font-semibold text-text">
                {photos.filter(p => p.isDuplicate).length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Claims</span>
              <span className="font-semibold text-text">
                {claims.filter(c => c.status === 'active').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Report Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReportCard
          title="Claims Summary Report"
          description="Complete overview of all claims with damage analysis"
          icon={FileText}
          onGenerate={() => generateReport('Claims Summary')}
        />
        <ReportCard
          title="Photo Analysis Report"
          description="Detailed breakdown of processed photos and AI insights"
          icon={BarChart3}
          onGenerate={() => generateReport('Photo Analysis')}
        />
        <ReportCard
          title="Quality Assurance Report"
          description="Report on photo quality scores and duplicate detection"
          icon={Download}
          onGenerate={() => generateReport('Quality Assurance')}
        />
      </div>
    </div>
  )
}