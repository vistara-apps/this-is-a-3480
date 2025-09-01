import { useState } from 'react'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts'
import { format, subDays, parseISO } from 'date-fns'

export default function ClaimTrendChart({ claims, title = "Claims Trend" }) {
  const [chartType, setChartType] = useState('line') // 'line' or 'area'
  const [timeRange, setTimeRange] = useState('month') // 'week', 'month', 'year'
  
  // Prepare data for the chart
  const prepareChartData = () => {
    // Get the date range based on the selected time range
    const today = new Date()
    let startDate
    let dateFormat
    
    switch (timeRange) {
      case 'week':
        startDate = subDays(today, 7)
        dateFormat = 'EEE'
        break
      case 'month':
        startDate = subDays(today, 30)
        dateFormat = 'MMM d'
        break
      case 'year':
        startDate = subDays(today, 365)
        dateFormat = 'MMM'
        break
      default:
        startDate = subDays(today, 30)
        dateFormat = 'MMM d'
    }
    
    // Filter claims by date
    const filteredClaims = claims.filter(claim => {
      const claimDate = parseISO(claim.dateReported)
      return claimDate >= startDate
    })
    
    // Group claims by date
    const claimsByDate = {}
    
    filteredClaims.forEach(claim => {
      const claimDate = parseISO(claim.dateReported)
      const formattedDate = format(claimDate, dateFormat)
      
      if (!claimsByDate[formattedDate]) {
        claimsByDate[formattedDate] = {
          date: formattedDate,
          total: 0,
          active: 0,
          completed: 0
        }
      }
      
      claimsByDate[formattedDate].total += 1
      
      if (claim.status === 'active') {
        claimsByDate[formattedDate].active += 1
      } else if (claim.status === 'completed') {
        claimsByDate[formattedDate].completed += 1
      }
    })
    
    // Convert to array and sort by date
    return Object.values(claimsByDate).sort((a, b) => {
      return a.date.localeCompare(b.date)
    })
  }
  
  const chartData = prepareChartData()
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-800">{label}</p>
          <div className="text-sm space-y-1 mt-1">
            {payload.map((entry, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-2"
                style={{ color: entry.color }}
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span>{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }
    return null
  }
  
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        
        <div className="flex space-x-2">
          {/* Time range selector */}
          <div className="flex space-x-1 bg-gray-100 rounded-md p-1">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-2 py-1 text-xs rounded-md ${
                timeRange === 'week' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-2 py-1 text-xs rounded-md ${
                timeRange === 'month' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-2 py-1 text-xs rounded-md ${
                timeRange === 'year' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Year
            </button>
          </div>
          
          {/* Chart type selector */}
          <div className="flex space-x-1 bg-gray-100 rounded-md p-1">
            <button
              onClick={() => setChartType('line')}
              className={`px-2 py-1 text-xs rounded-md ${
                chartType === 'line' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-2 py-1 text-xs rounded-md ${
                chartType === 'area' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Area
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow-sm">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            {chartType === 'line' ? (
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                />
                <YAxis 
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  name="Total Claims"
                />
                <Line 
                  type="monotone" 
                  dataKey="active" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  name="Active Claims"
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  name="Completed Claims"
                />
              </LineChart>
            ) : (
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                />
                <YAxis 
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stackId="1"
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.6}
                  name="Total Claims"
                />
                <Area 
                  type="monotone" 
                  dataKey="active" 
                  stackId="2"
                  stroke="#F59E0B" 
                  fill="#F59E0B" 
                  fillOpacity={0.6}
                  name="Active Claims"
                />
                <Area 
                  type="monotone" 
                  dataKey="completed" 
                  stackId="3"
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.6}
                  name="Completed Claims"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No data available for the selected time range</p>
          </div>
        )}
      </div>
    </div>
  )
}

