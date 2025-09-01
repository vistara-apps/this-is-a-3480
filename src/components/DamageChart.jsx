import { useState } from 'react'
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts'
import { Droplet, Flame, Cloud, Home, Zap, Shield } from 'lucide-react'

// Color palette for different damage types
const DAMAGE_COLORS = {
  'Water Damage': '#3B82F6', // blue
  'Fire Damage': '#EF4444',  // red
  'Storm Damage': '#8B5CF6', // purple
  'Structural Damage': '#F59E0B', // amber
  'Electrical Damage': '#10B981', // emerald
  'Vandalism': '#6B7280',    // gray
  'Other': '#9CA3AF'         // gray
}

// Icons for different damage types
const DAMAGE_ICONS = {
  'Water Damage': Droplet,
  'Fire Damage': Flame,
  'Storm Damage': Cloud,
  'Structural Damage': Home,
  'Electrical Damage': Zap,
  'Vandalism': Shield,
  'Other': Shield
}

export default function DamageChart({ data, title = "Damage Distribution" }) {
  const [chartType, setChartType] = useState('pie') // 'pie' or 'bar'
  
  // Format data for the chart
  const chartData = data.map(item => ({
    ...item,
    color: DAMAGE_COLORS[item.name] || '#9CA3AF',
    Icon: DAMAGE_ICONS[item.name] || Shield
  }))
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const Icon = data.Icon
      
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-1">
            <Icon className="h-4 w-4" style={{ color: data.color }} />
            <span className="font-medium">{data.name}</span>
          </div>
          <div className="text-sm text-gray-600">
            <div>Count: {data.value}</div>
            <div>Percentage: {((data.value / chartData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%</div>
          </div>
        </div>
      )
    }
    return null
  }
  
  // Custom legend component
  const CustomLegend = ({ payload }) => {
    return (
      <ul className="flex flex-wrap justify-center gap-3 mt-4">
        {payload.map((entry, index) => {
          const Icon = entry.payload.Icon
          return (
            <li key={`legend-${index}`} className="flex items-center space-x-1">
              <Icon className="h-4 w-4" style={{ color: entry.color }} />
              <span className="text-xs text-gray-700">{entry.value}</span>
            </li>
          )
        })}
      </ul>
    )
  }
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        <div className="flex space-x-1">
          <button
            onClick={() => setChartType('pie')}
            className={`px-3 py-1 text-xs rounded-l-md ${
              chartType === 'pie' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Pie
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 text-xs rounded-r-md ${
              chartType === 'bar' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Bar
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <ResponsiveContainer width="100%" height={300}>
          {chartType === 'pie' ? (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                innerRadius={60}
                paddingAngle={2}
                dataKey="value"
                animationDuration={800}
                animationBegin={0}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke="white"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          ) : (
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={100}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                animationDuration={800}
                animationBegin={0}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
