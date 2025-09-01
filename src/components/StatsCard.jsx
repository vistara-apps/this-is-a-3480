export default function StatsCard({ title, value, icon: Icon, color }) {
  return (
    <div className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-text">{value}</p>
        </div>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${color} rounded-lg flex items-center justify-center shadow-md`}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}
