import { useEffect, useState, useRef } from "react";
import PopoverMenu from "./counterTabPopups";
import { getsActiveUser, getWeeklyProductInquiries, getUserActivitySummary } from '../../api/DashBoardApi';
import { AppUserChart, InquiriesChart, TotalOrdersChart } from "./charts";
import { getWeeklyInquiries } from '../../api/DashBoardApi';
import { WeeklyInquiry, LoginUser, SignupUser, ContactUsUser, InquiryPerformer,TotalOrderDataType, UserActivityResponse } from '../../utils/types';

type ActivityRange = "7" | "15" | "30";
export default function Dashboard() {
  const [selectedButton, setSelectedButton] = useState("logins");
  const [selectedRange, setSelectedRange] = useState("7");
  const [distributorRange, setDistributorRange] = useState("7"); // separate filter
  const [activeUserRange, setActiveUserRange] = useState("7"); // 🔸 new
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [salespersonRange, setSalespersonRange] = useState("7");
  const [inquiryRange, setInquiryRange] = useState("7");
  const [weeklyInquiryData, setWeeklyInquiryData] = useState<WeeklyInquiry[]>([]);
  const [inquiryMonth, setInquiryMonth] = useState<"currentMonth" | "lastMonth">("currentMonth");
  const [productMonth, setProductMonth] = useState<"currentMonth" | "lastMonth">("currentMonth");
  const [productChartData, setProductChartData] = useState<TotalOrderDataType[]>([]);
  const [userActivity, setUserActivity] = useState<UserActivityResponse | null>(null);;
  const [activityRange, setActivityRange] = useState<ActivityRange>("7")
const scrollRef = useRef<HTMLDivElement | null>(null);

function getUserColor(nameOrEmail: string) {
  const colors = [
    ["#FEE2E2", "#B91C1C"], // Red
    ["#FEF3C7", "#B45309"], // Amber
    ["#D1FAE5", "#065F46"], // Green
    ["#DBEAFE", "#1D4ED8"], // Blue
    ["#E0E7FF", "#4338CA"], // Indigo
    ["#F3E8FF", "#7C3AED"], // Purple
    ["#FDE68A", "#92400E"], // Orange
    ["#CFFAFE", "#0891B2"], // Cyan
    ["#E9D5FF", "#6B21A8"], // Violet
    ["#FAE8FF", "#A21CAF"], // Fuchsia
  ];
  const hash = [...nameOrEmail].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getsActiveUser();
        setDashboardStats(res);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };
    fetchStats();
  }, []);

 useEffect(() => {
  const fetchWeeklyData = async () => {
    try {
      const res = await getWeeklyInquiries();
      setWeeklyInquiryData(inquiryMonth === "currentMonth" ? res.currentMonth : res.lastMonth);
    } catch (err) {
      console.error("Error fetching weekly inquiry chart", err);
    }
  };
  fetchWeeklyData();
}, [inquiryMonth]);

useEffect(() => {
  const fetchProductData = async () => {
    try {
      const res = await getWeeklyProductInquiries();
      setProductChartData(productMonth === "currentMonth" ? res.currentMonth : res.lastMonth);
    } catch (error) {
      console.error("Failed to fetch product chart data:", error);
    }
  };
  fetchProductData();
}, [productMonth]);

useEffect(() => {
  const fetchUserActivity = async () => {
    try {
      const res = await getUserActivitySummary();
      console.log("User Activity Response", res);
      setUserActivity(res);
    } catch (err) {
      console.error("Error fetching user activity summary:", err);
    }
  };
  fetchUserActivity();
}, []);

useEffect(() => {
  if (scrollRef.current) {
    scrollRef.current.scrollTop = 0;
  }
}, [selectedButton, activityRange]);


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Welcome to Dashboard</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Distributor card with range filtering */}
        {dashboardStats && (
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <div className="flex items-center justify-between">
              <dt className="truncate text-base font-medium text-gray-500">Distributors</dt>
              <PopoverMenu onSelect={(range) => setDistributorRange(range)} selectedRange={distributorRange} />
            </div>

            <dd className="mt-5 text-5xl font-semibold text-blue-500 flex justify-center">
              {
                distributorRange === "7"
                  ? dashboardStats.distributors?.new?.last7Days ?? 0
                  : distributorRange === "15"
                  ? dashboardStats.distributors?.new?.last15Days ?? 0
                  : dashboardStats.distributors?.new?.last30Days ?? 0
              }
            </dd>
          </div>
        )}
        
        {dashboardStats && (
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <div className="flex items-center justify-between">
              <dt className="truncate text-base font-medium text-gray-500">Sales Persons</dt>
              <PopoverMenu onSelect={(range) => setSalespersonRange(range)} selectedRange={salespersonRange}/>
            </div>
            <dd className="mt-5 text-5xl font-semibold text-yellow-500 flex justify-center">
              {
                salespersonRange === "7"
                  ? dashboardStats.salespersons?.new?.last7Days ?? 0
                  : salespersonRange === "15"
                  ? dashboardStats.salespersons?.new?.last15Days ?? 0
                  : dashboardStats.salespersons?.new?.last30Days ?? 0
              }
            </dd>
          </div>
        )}

        {dashboardStats && (
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <div className="flex items-center justify-between">
              <dt className="truncate text-base font-medium text-gray-500">Product Inquiries</dt>
              <PopoverMenu onSelect={(range) => setInquiryRange(range)} selectedRange={inquiryRange}/>
            </div>
            <dd className="mt-5 text-5xl font-semibold text-red-700 flex justify-center">
              {
                inquiryRange === "7"
                  ? dashboardStats.productInquiries?.new?.last7Days ?? 0
                  : inquiryRange === "15"
                  ? dashboardStats.productInquiries?.new?.last15Days ?? 0
                  : dashboardStats.productInquiries?.new?.last30Days ?? 0
              }
            </dd>
          </div>
        )}
        
        {dashboardStats && (
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <div className="flex items-center justify-between">
              <dt className="truncate text-base font-medium text-gray-500">Active Users</dt>
              <PopoverMenu onSelect={(range) => setActiveUserRange(range)} selectedRange={activeUserRange}/>
            </div>
            <dd className="mt-5 text-5xl font-semibold text-teal-700 flex justify-center">
              {
                activeUserRange === "7"
                  ? dashboardStats.users?.active?.last7Days ?? 0
                  : activeUserRange === "15"
                  ? dashboardStats.users?.active?.last15Days ?? 0
                  : dashboardStats.users?.active?.last30Days ?? 0
              }
            </dd>
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_2fr]">
        <AppUserChart selectedRange={selectedRange} onRangeChange={setSelectedRange} />
        <InquiriesChart
          data={weeklyInquiryData}
          onMonthChange={(month: "currentMonth" | "lastMonth") => setInquiryMonth(month)}
          selectedMonth={inquiryMonth}
        />


      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Recent Activities</h3>
            <PopoverMenu onSelect={(range) => setActivityRange(range as ActivityRange)} selectedRange={activityRange} />
          </div>

          <div className="flex gap-3 mb-6">
            {[
              { label: "Logins", value: "logins" },
              { label: "Signups", value: "signups" },
              { label: "Contact Us", value: "Contact Us" },
              { label: "Inquires", value: "Inquiry Users" },
            ].map((btn) => (
              <button
                key={btn.value}
                onClick={() => setSelectedButton(btn.value)}
                className={`px-5 py-1.5 rounded-full text-base font-medium !border border-[#C90119] cursor-pointer
                  ${selectedButton === btn.value ? "!bg-[#C90119] text-white" : "bg-white text-[#C90119]"}`}
              >
                {btn.label}
              </button>
            ))}
          </div>


          <div ref={scrollRef} className="max-h-72 divide-y divide-gray-100 overflow-y-auto">
            {selectedButton === "logins" && userActivity && (() => {
              const logins =
                activityRange === "7"
                  ? userActivity.logins?.last7Days
                  : activityRange === "15"
                  ? userActivity.logins?.last15Days
                  : userActivity.logins?.last30Days;

              return logins && logins.length > 0 ? (
                logins.map((item: LoginUser, idx: number) => (
                  <div key={idx} className="flex items-center py-4">
                    {(() => {
                      const [bgColor, textColor] = getUserColor(item.email || item.name);
                      return (
                        <div
                          className="h-10 w-10 rounded-full flex items-center justify-center font-bold mr-3"
                          style={{ backgroundColor: bgColor, color: textColor }}
                        >
                          {item.name?.slice(0, 1)?.toUpperCase()}
                        </div>
                      );
                    })()}
                    <div className="flex w-full items-center space-x-4">
                      <div className="w-1/3 text-base font-medium text-gray-900 truncate">
                        {item.name}
                      </div>
                      <div className="w-1/3 text-base text-gray-500 truncate">
                        {item.email}
                      </div>
                      <div className="w-1/4 text-base text-gray-500 text-right shrink-0">
                        {item.lastActive}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">No logins performed</div>
              );
            })()}


            {selectedButton === "signups" && userActivity && (() => {
              const signups =
                activityRange === "7"
                  ? userActivity.signups?.last7Days
                  : activityRange === "15"
                  ? userActivity.signups?.last15Days
                  : userActivity.signups?.last30Days;

              return signups && signups.length > 0 ? (
                signups.map((item: SignupUser, idx: number) => (
                  <div key={idx} className="flex items-center py-4">
                    {(() => {
                      const [bgColor, textColor] = getUserColor(item.email || item.name);
                      return (
                        <div
                          className="h-10 w-10 rounded-full flex items-center justify-center font-bold mr-3"
                          style={{ backgroundColor: bgColor, color: textColor }}
                        >
                          {item.name?.slice(0, 1)?.toUpperCase()}
                        </div>
                      );
                    })()}
                    <div className="flex w-full items-center space-x-4">
                      <div className="w-1/3 text-base font-medium text-gray-900 truncate" title={item.name}>
                        {item.name}
                      </div>
                      <div className="w-1/3 text-base text-gray-500 truncate" title={item.email}>
                        {item.email}
                      </div>
                      <div className="w-1/4 text-base text-gray-500 text-right shrink-0">
                        {item.daysSinceSignup}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">No signups performed</div>
              );
            })()}


           {selectedButton === "Contact Us" && userActivity && (() => {
              const contacts =
                activityRange === "7"
                  ? userActivity.contactUsFormUsers?.last7Days
                  : activityRange === "15"
                  ? userActivity.contactUsFormUsers?.last15Days
                  : userActivity.contactUsFormUsers?.last30Days;

              return contacts && contacts.length > 0 ? (
                contacts.map((item: ContactUsUser, idx: number) => (
                  <div key={idx} className="flex items-center py-4">
                    {(() => {
                      const [bgColor, textColor] = getUserColor(item.email || item.name);
                      return (
                        <div
                          className="h-10 w-10 rounded-full flex items-center justify-center font-bold mr-3"
                          style={{ backgroundColor: bgColor, color: textColor }}
                        >
                          {item.name?.slice(0, 1)?.toUpperCase()}
                        </div>
                      );
                    })()}
                    <div className="flex w-full items-center space-x-4">
                      <div className="w-1/3 text-sm font-medium text-gray-900 truncate" title={item.name}>
                        {item.name}
                      </div>
                      <div className="w-1/3 text-base text-gray-500 truncate" title={item.email}>
                        {item.email}
                      </div>
                      <div className="w-1/4 text-base text-gray-500 text-right shrink-0">
                        {item.lastContact}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">No contacts performed</div>
              );
            })()}


           {selectedButton === "Inquiry Users" && userActivity && (() => {
              const selectedData =
                activityRange === "7"
                  ? userActivity.inquiryPerformers?.last7Days
                  : activityRange === "15"
                  ? userActivity.inquiryPerformers?.last15Days
                  : userActivity.inquiryPerformers?.last30Days;

              return selectedData && selectedData.length > 0 ? (
                selectedData.map((item: InquiryPerformer, idx: number) => (
                  <div key={idx} className="flex items-center py-4">
                    {(() => {
                      const [bgColor, textColor] = getUserColor(item.email || item.name);
                      return (
                        <div
                          className="h-10 w-10 rounded-full flex items-center justify-center font-bold mr-3"
                          style={{ backgroundColor: bgColor, color: textColor }}
                        >
                          {item.name?.slice(0, 1)?.toUpperCase()}
                        </div>
                      );
                    })()}
                    <div className="flex w-full items-center space-x-4">
                      <div className="w-1/3 text-base font-medium text-gray-900 truncate" title={item.name}>
                        {item.name}
                      </div>
                      <div className="w-1/3 text-base text-gray-500 truncate" title={item.email}>
                        {item.email}
                      </div>
                      <div className="w-1/4 text-base text-gray-500 text-right shrink-0">
                        {item[`last${activityRange}Days`]} inquiries
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-6">No inquiries found</div>
              );
            })()}




          </div>
        </div>

        <TotalOrdersChart data={productChartData}
          selectedMonth={productMonth}
          onMonthChange={setProductMonth} />
      </div>
    </div>
  );
}
