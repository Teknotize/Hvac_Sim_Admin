import { stats } from "../../utils/constants";
import PopoverMenu from "./counterTabPopups";
import { tempAppUserData,tempInquiriesData,tempTotalOrdersData } from "../../utils/constants";
import { AppUserChart,InquiriesChart,TotalOrdersChart } from "./charts";
import { recentActivityButtons ,TestData} from "../../utils/constants";
import { useState } from "react";
export default function Dashboard() {
  const [selectedButton, setSelectedButton] = useState<string>(recentActivityButtons[0]?.label);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome to Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <div className="flex items-center justify-between">
              <dt className="truncate text-sm font-medium text-gray-500">{stat.name}</dt>
              <PopoverMenu />
            </div>
            <dd className={`mt-5 text-5xl font-semibold ${stat.color} flex justify-center`}>
              {Number(stat.value) < 10 ? `0${Number(stat.value)}` : String(stat.value)}
            </dd>
            <dt className={`mt-1 text-sm font-semibold flex justify-center ${stat.color}`}>
              {stat.subText}
            </dt>
            <dt className="mt-5 text-xs font-light text-gray-500 flex justify-center">
              {`Till date : ${stat.till}`}
            </dt>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_2fr]">
        <AppUserChart data={tempAppUserData} />
        <InquiriesChart data={tempInquiriesData} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
       <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
          <PopoverMenu />
        </div>

        <div className="flex gap-3 mb-6">
          {recentActivityButtons.map((btn) => (
              <button
                      key={btn.label}
                      onClick={() => setSelectedButton(btn.label)}
                      className={`px-5 py-1.5 rounded-full text-sm font-medium !border-1 cursor-pointer
                        ${selectedButton === btn.label
                          ? "!bg-red-700 text-white !border-red-700"
                          : "bg-white text-red-700 !border-red-700"}
                        transition-colors`}
                    >
                      {btn.label}
                    </button>
          ))}
        </div>
        <div className="divide-y divide-gray-100">
            {TestData.map((item, idx) => (
            <div
          key={idx}
          className="flex items-center py-4"
        >
          <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold mr-3 ${item.color}`}>
            {item.initials}
          </div>
          <div className="flex w-full">
            <div className="text-sm font-medium text-gray-900 flex-1">{item.name}</div>
            <div className="text-xs text-gray-500 flex-1">{item.email}</div>
            <div className="text-xs text-gray-500 flex justify-end items-center w-24">{item.time}</div>
          </div>
        </div>
            ))}
          </div>
        </div>

        <TotalOrdersChart data={tempTotalOrdersData} />
      </div>
    </div>
  );
}