// Charts.jsx
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { AppUserDataType,InquiryDataType, ProductInquiryWeek} from '../../utils/types';
import PopoverMenu from './counterTabPopups';
import InquiryMonthPopover from './inquiryTablePop';
import { getsActiveUser } from '../../api/DashBoardApi';
import { useEffect, useState } from 'react';

const COLORS = ['#b92825', '#ffa800']; // Total User, Active User
const LEGEND_COLORS = ['#b92825', '#ffa800'];
const PRODUCT_COLORS = [
  '#b92825', '#FF5275', '#1943A1', '#1F9E8A', '#4caf50', '#FD9D21', '#4D00DE', '#299DFA'
];

export function AppUserChart({ selectedRange, onRangeChange }: {
  selectedRange: string;
  onRangeChange: (range: string) => void;
}) {
  const [chartData, setChartData] = useState<AppUserDataType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getsActiveUser(); // API call
        const total = res?.users?.total || 0;

        // dynamic access
        const active = res?.users?.active?.[`last${selectedRange}Days`] || 0;

        const data: AppUserDataType[] = [
          { name: 'Total Users', value: total },
          { name: 'Active Users', value: active }
        ];

        setChartData(data);
      } catch (error) {
        console.error('Failed to fetch user chart data:', error);
      } 
    };

    fetchData();
  }, [selectedRange]); // depends on selected range

  return (
    <div className="p-4 bg-white rounded shadow w-full">
      <div className="flex justify-between items-start mb-5">
        <h2 className="font-semibold text-black text-xl">App User</h2>
        <PopoverMenu onSelect={onRangeChange} selectedRange={selectedRange}/>
      </div>

      <div className="flex items-center justify-between align-center h-100">
        <div className="space-y-4">
          {chartData.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2">
              <div>
                <div className='flex flex-row justify-center items-center gap-2'>
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: LEGEND_COLORS[index] }}
                  />
                  <p className="text-sm text-gray-600">{item.name}</p>
                </div>
                <p className="text-lg font-bold text-indigo-900 flex justify-center">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <PieChart width={380} height={280}>
          <Tooltip />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={({ percent }) =>
              percent !== undefined ? `${(percent * 100).toFixed(0)}%` : ''
            }
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </div>
    </div>
  );
}
export function InquiriesChart({
  data,
  selectedMonth,
  onMonthChange,
}: {
  data: InquiryDataType[];
  selectedMonth: "currentMonth" | "lastMonth";
  onMonthChange: (month: "currentMonth" | "lastMonth") => void;
}) {
  // Optional: ensure even 0 values show as tiny bars
  const adjustedData = data.map((d) => ({
    ...d,
    totalInquiries: d.totalInquiries === 0 ? 0.0 : d.totalInquiries,
  }));

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-black font-semibold text-xl">Inquiries</h2>
        <InquiryMonthPopover
          selected={selectedMonth}
          onSelect={onMonthChange}
          options={[
            { label: "Current Month", value: "currentMonth" },
            { label: "Last Month", value: "lastMonth" },
          ]}
        />
      </div>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={adjustedData} barSize={60} barCategoryGap="8%">
            <CartesianGrid strokeDasharray="" vertical={false} />
            <XAxis
              dataKey="weekNumber"
              tickFormatter={(value) => `Week ${value}`}
            />
            <YAxis
              domain={[0, "auto"]}
              tickFormatter={(value) => Math.floor(value).toString()}
              allowDecimals={false}
            />
            <Tooltip />
            <Bar
              dataKey="totalInquiries"
              fill="rgba(212, 7, 4, 0.37)"
              // shape={<RoundedTopBar />}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TotalOrdersChart({ data, selectedMonth, onMonthChange }: {
  data: ProductInquiryWeek[];
  selectedMonth: "currentMonth" | "lastMonth";
  onMonthChange: (month: "currentMonth" | "lastMonth") => void;
}) {
  try {
    const productKeys = Array.from(
      new Set(
        data.flatMap(item =>
          Object.keys(item).filter(key => key !== "name" && key !== "weekNumber")
        )
      )
    );

    return (
      <div className="p-4 bg-white rounded shadow">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-black font-semibold mb-2 text-xl">Total Orders</h2>
          <InquiryMonthPopover
            selected={selectedMonth}
            onSelect={onMonthChange}
            options={[
              { label: "Current Month", value: "currentMonth" },
              { label: "Last Month", value: "lastMonth" },
            ]}
          />
        </div>
        <div className="flex justify-center items-center w-full">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <CartesianGrid stroke="#e0e0e0" vertical={false} />
              <XAxis dataKey="name" interval={0} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip />
              <Legend
                formatter={(value: string) => (
                  <span title={value} className="truncate block w-24">
                    {value.length > 12 ? value.slice(0, 12) + "…" : value}
                  </span>
                )}
              />
              {productKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  barSize={20}
                  fill={PRODUCT_COLORS[index % PRODUCT_COLORS.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering TotalOrdersChart:", error);
    return <div className="text-red-500">Chart failed to render</div>;
  }
}
