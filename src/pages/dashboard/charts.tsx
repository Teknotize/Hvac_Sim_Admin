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
import { AppUserDataType,InquiryDataType,TotalOrderDataType } from '../../utils/types';
import PopoverMenu from './counterTabPopups';

const COLORS = ['#b92825', '#ffa800']; // Total User, Active User
const LEGEND_COLORS = ['#b92825', '#ffa800'];

export function AppUserChart({ data }: { data: AppUserDataType[] }) {
  return (
    <div className="p-4 bg-white rounded shadow w-full ">
      <div className="flex justify-between items-start mb-5">
        <h2 className="font-semibold text-black">App User</h2>
        <PopoverMenu />
      </div>

      <div className="flex items-center justify-between align-center h-100 ">
        {/* Left side: Legend + Values */}
        <div className="space-y-4">
          {data.map((item, index) => (
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

        {/* Right side: Pie chart */}
        <PieChart width={280} height={280}>
          <Tooltip />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={({ percent }) =>
              percent !== undefined ? `${(percent * 100).toFixed(0)}%` : ''
            }
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </div>
    </div>
  );
}

const RoundedTopBar = (props: any) => {
  const { x, y, width, height, fill } = props;
  const radius = 6;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height - radius} fill={fill} opacity={0.3} />
      <rect
        x={x}
        y={y}
        width={width}
        height={radius}
        rx={radius}
        ry={radius}
        fill={fill}
      />
    </g>
  );
};

export function InquiriesChart({ data }: { data: InquiryDataType[] }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-black font-semibold text-sm">Inquiries</h2>
        <PopoverMenu />
      </div>
      <div className="w-full h-[300px]">
     <ResponsiveContainer width="100%" height="100%">
  <BarChart
    data={data}
    barSize={80} // or 45 depending on your width
    barCategoryGap="5%" // reduce from default 20–25% to 5% or even "0%" to bring bars closer
  >
    <CartesianGrid strokeDasharray="3 3" vertical={false} />
    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
    <YAxis
      tick={{ fontSize: 12 }}
      tickFormatter={(tick) => `${tick / 1000}K`}
      domain={[0, 'auto']}
    />
    <Tooltip />
    <Bar
      dataKey="inquiries"
      fill="#b92825"
      shape={<RoundedTopBar />}
      radius={[6, 6, 0, 0]}
    />
  </BarChart>
</ResponsiveContainer>

      </div>
    </div>
  );
}
export function TotalOrdersChart({ data }: { data: TotalOrderDataType[] }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <div className='flex justify-between items-center mb-5'>
      <h2 className="text-black font-semibold mb-2">Total Orders</h2>
      <PopoverMenu/>
      </div>
      <div className='flex justify-center items-center'>
        <BarChart width={600} height={350} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Abc" fill={COLORS[0]} />
          <Bar dataKey="Xyz" fill={COLORS[1]} />
      </BarChart>
      </div>
    </div>
  );
}
