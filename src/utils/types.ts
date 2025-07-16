import { recentActivityButtons } from "./constants";
export type AppUserDataType = {
    name: 'Active User' | 'Total User';
    value: number;
};



export type WeeklyInquiry = {
  weekNumber: number;
  startDate: string;
  endDate: string;
  totalInquiries: number;
};

export interface UserActivity {
  name: string;
  email: string;
  lastActiveDays: number;
}

export type InquiryChartResponse = {
  currentMonth: WeeklyInquiry[];
  lastMonth: WeeklyInquiry[];
};

export type ProductInquiryWeek = {
  weekNumber: number;
  name: string; // "Week 1", etc.
  [productName: string]: number | string; // dynamic keys for product bars
};

export type ProductInquiryChartResponse = {
  currentMonth: ProductInquiryWeek[];
  lastMonth: ProductInquiryWeek[];
};

export type RecentActivityType = typeof recentActivityButtons[number];

export type ActiveUserEntry = {
  name: string;
  email: string;
  daysSinceLastActive: number;
};

export type InquiryPerformerEntry = {
  name: string;
  email: string;
  inquiriesCount: number;
};

export type InquiryPerformerRange = {
  name: string;
  email: string;
  last7Days: number;
  last15Days: number;
  last30Days: number;
};

export type InquiryPerformerGrouped = {
  last7Days: InquiryPerformerRange[];
  last15Days: InquiryPerformerRange[];
  last30Days: InquiryPerformerRange[];
};

export type UserActivityResponse = {
  usersActive: {
    last7Days: ActiveUserEntry[];
    last15Days: ActiveUserEntry[];
    last30Days: ActiveUserEntry[];
  };
  inquiryPerformers: InquiryPerformerGrouped;
};
