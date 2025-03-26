
export default function Dashboard() {
  
  const stats = [
    { name: 'Active Systems', value: '24' },
    { name: 'Alerts', value: '3' },
    { name: 'Efficiency', value: '92%' },
    { name: 'Energy Usage', value: '1.2 kWh' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="mt-1 text-sm text-gray-500">
          Monitor your HVAC systems and performance metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <dt className="truncate text-sm font-medium text-gray-500">{stat.name}</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</dd>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          <div className="mt-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-indigo-600">{i}</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    System {i} temperature adjusted
                  </p>
                  <p className="text-sm text-gray-500">
                    {i * 10} minutes ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900">System Status</h3>
          <div className="mt-4 space-y-4">
            {['HVAC Unit 1', 'HVAC Unit 2', 'HVAC Unit 3'].map((unit, i) => (
              <div key={unit} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{unit}</p>
                  <p className="text-sm text-gray-500">
                    {i === 1 ? 'Warning: Filter change needed' : 'Operating normally'}
                  </p>
                </div>
                <div className={`h-3 w-3 rounded-full ${i === 1 ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 