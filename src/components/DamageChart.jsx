import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

// Color palette for different damage types
const DAMAGE_TYPE_COLORS = {
  water: '#3B82F6',    // Blue
  fire: '#EF4444',     // Red
  storm: '#8B5CF6',    // Purple
  mold: '#10B981',     // Green
  structural: '#F59E0B', // Amber
  impact: '#6B7280',   // Gray
  default: '#3B82F6'   // Default blue
};

// Color palette for severity levels
const SEVERITY_COLORS = {
  low: '#10B981',      // Green
  medium: '#F59E0B',   // Amber
  high: '#EF4444',     // Red
  default: '#6B7280'   // Gray
};

export default function DamageChart({ data, type = 'damage', title }) {
  // Format data for the chart based on type
  const formatChartData = () => {
    if (!data) return [];
    
    if (type === 'damage') {
      // Format damage type data
      return Object.entries(data).map(([type, count]) => ({
        name: type.charAt(0).toUpperCase() + type.slice(1),
        value: count,
        color: DAMAGE_TYPE_COLORS[type] || DAMAGE_TYPE_COLORS.default
      }));
    } else if (type === 'severity') {
      // Format severity data
      return [
        { name: 'Low', value: data.low || 0, color: SEVERITY_COLORS.low },
        { name: 'Medium', value: data.medium || 0, color: SEVERITY_COLORS.medium },
        { name: 'High', value: data.high || 0, color: SEVERITY_COLORS.high }
      ].filter(item => item.value > 0);
    } else if (type === 'location') {
      // Format location data for bar chart
      return Object.entries(data)
        .map(([location, count]) => ({
          name: location.charAt(0).toUpperCase() + location.slice(1),
          value: count,
          color: '#3B82F6'
        }))
        .sort((a, b) => b.value - a.value) // Sort by count descending
        .slice(0, 5); // Take top 5 locations
    }
    
    return [];
  };

  const chartData = formatChartData();
  
  // If no data, show empty state
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Render pie chart for damage types and severity
  if (type === 'damage' || type === 'severity') {
    return (
      <div className="bg-white rounded-lg p-4">
        {title && <h3 className="text-lg font-medium text-gray-800 mb-4">{title}</h3>}
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} photos`, 'Count']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  // Render bar chart for locations
  if (type === 'location') {
    return (
      <div className="bg-white rounded-lg p-4">
        {title && <h3 className="text-lg font-medium text-gray-800 mb-4">{title}</h3>}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fontSize: 12 }}
            />
            <Tooltip formatter={(value) => [`${value} photos`, 'Count']} />
            <Bar dataKey="value" fill="#3B82F6" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  return null;
}
