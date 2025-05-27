import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  
  const stats = [
    { name: 'Distributors', value: '08', status: 'Open', till: '20', color: '#3B82F6' },
    { name: 'Sales Persons', value: '24', status: 'Lorem Ipsium', till: '20', color: '#FFA800' },
    { name: 'Inquiries', value: '15', status: 'Open', till: '20', color: '#B92825' },
    { name: 'Active Users', value: '63', status: 'Lorem Ipsium', till: '20', color: '#008578' },
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
            className="dashCard"
          >
            <Popover className="action-drop">
              <PopoverButton className="block">
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </PopoverButton>
              <PopoverPanel
                transition
                anchor="bottom end"
                className="action-popover shadow-xl transition duration-200 ease-in-out data-[closed]:-translate-y-1 data-[closed]:opacity-0"
              >
                <div className="action-menu">
                  <Link to="/" className="action-menu-item">
                    <p>Enable</p>
                  </Link>
                  <Link to="/" className="action-menu-item">
                    <p>Disable</p>
                  </Link>
                  <Link to="/" className="action-menu-item">
                    <p>Edit</p>
                  </Link>
                  <Link to="/" className="action-menu-item">
                    <p>Delete</p>
                  </Link>
                </div>
              </PopoverPanel>
            </Popover>
            
            <h4>{stat.name}</h4>
            <div className="stat" style={{ color: stat.color }}>
              <p>{stat.value}</p>
              <p>{stat.status}</p>
            </div>

            <p>Till date: {stat.till}</p>
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