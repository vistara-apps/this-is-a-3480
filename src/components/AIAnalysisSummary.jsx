import { Brain, AlertTriangle, Gauge, MapPin, BarChart3 } from 'lucide-react'

export default function AIAnalysisSummary({ report, claimId }) {
  if (!report) return null;

  // Get severity color based on average severity
  const getSeverityColor = (score) => {
    if (score < 40) return 'text-green-500';
    if (score < 75) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Format damage type counts for display
  const formatDamageTypes = () => {
    if (!report.damageTypeCounts) return [];
    
    return Object.entries(report.damageTypeCounts)
      .sort((a, b) => b[1] - a[1]) // Sort by count (descending)
      .map(([type, count]) => ({
        type,
        count,
        percentage: Math.round((count / report.totalImages) * 100)
      }));
  };

  // Format location counts for display
  const formatLocations = () => {
    if (!report.locationCounts) return [];
    
    return Object.entries(report.locationCounts)
      .sort((a, b) => b[1] - a[1]) // Sort by count (descending)
      .slice(0, 3) // Top 3 locations
      .map(([location, count]) => ({
        location,
        count,
        percentage: Math.round((count / report.totalImages) * 100)
      }));
  };

  const damageTypes = formatDamageTypes();
  const topLocations = formatLocations();
  const severityColor = getSeverityColor(report.averageSeverity);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="bg-blue-50 p-4 border-b border-blue-100">
        <div className="flex items-center">
          <Brain className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-blue-900">AI Analysis Summary</h3>
        </div>
        <p className="text-sm text-blue-700 mt-1">
          Automated assessment of {report.totalImages} photos using computer vision
        </p>
      </div>

      <div className="p-4">
        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Primary Damage</p>
            <p className="text-lg font-semibold text-gray-800">{report.primaryDamageTypeName || 'Unknown'}</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Avg. Severity</p>
            <p className={`text-lg font-semibold ${severityColor}`}>
              {Math.round(report.averageSeverity)}/100
            </p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">High Severity</p>
            <p className="text-lg font-semibold text-gray-800">
              {report.highSeverityCount} photos
            </p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Anomalies</p>
            <p className="text-lg font-semibold text-gray-800">
              {report.anomalyCount} detected
            </p>
          </div>
        </div>

        {/* Damage type breakdown */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <BarChart3 className="h-4 w-4 text-blue-500 mr-1" />
            Damage Type Distribution
          </h4>
          
          <div className="space-y-2">
            {damageTypes.map(({ type, count, percentage }) => (
              <div key={type} className="bg-gray-50 p-2 rounded">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{type.charAt(0).toUpperCase() + type.slice(1)} Damage</span>
                  <span>{count} photos ({percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top locations */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <MapPin className="h-4 w-4 text-blue-500 mr-1" />
            Most Affected Areas
          </h4>
          
          <div className="grid grid-cols-3 gap-2">
            {topLocations.map(({ location, count, percentage }) => (
              <div key={location} className="bg-gray-50 p-2 rounded text-center">
                <p className="text-xs text-gray-500">{location}</p>
                <p className="text-sm font-medium">{count} photos</p>
                <p className="text-xs text-gray-500">({percentage}%)</p>
              </div>
            ))}
          </div>
        </div>

        {/* Critical findings */}
        {report.criticalAnomalyCount > 0 && (
          <div className="bg-red-50 p-3 rounded-lg border border-red-100">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
              <h4 className="text-sm font-medium text-red-700">Critical Findings</h4>
            </div>
            <p className="text-xs text-red-600">
              {report.criticalAnomalyCount} high-severity anomalies detected that may require immediate attention.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

