import { recentActivityButtons } from "./constants";
export type AppUserDataType = {
    name: 'Active User' | 'Total User';
    value: number;
};
export type TotalOrderDataType = {
  name: string;
  weekNumber: number;
  [productName: string]: string | number; // For dynamic product keys like "Abc", "Def", etc.
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


export type InquiryDataType = {
  weekNumber: number;
  totalInquiries: number;
};

export type Distributor = {
  _id: string;
  distributorName: string;
  state: string;
  salesperson1: string;
  salesperson2: string;
  salesperson3: string;
  Status: "Active" | "Inactive";
};

export type UserActivityItem = {
  name: string;
  email: string;
  lastActive?: string;
  daysSinceSignup?: number;
  lastContact?: string;
  [key: string]: any;
};

export type UserActivityRange = {
  last7Days: UserActivityItem[];
  last15Days: UserActivityItem[];
  last30Days: UserActivityItem[];
};

export type UserActivityResponse = {
  logins: UserActivityRange;
  signups: UserActivityRange;
  contactUsFormUsers: UserActivityRange;
  inquiryPerformers: UserActivityRange;
};
