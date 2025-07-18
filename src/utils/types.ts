import { recentActivityButtons } from "./constants";
export type AppUserDataType = {
  name: "Active User" | "Total User" | "Active Users" | "Total Users";
  value: number;
};
export type InquiryDataType = {
  weekNumber: number;
  startDate: string;
  endDate: string;
  totalInquiries: number;
};
export interface UserActivityResponse {
  logins: {
    last7Days: LoginUser[];
    last15Days: LoginUser[];
    last30Days: LoginUser[];
  };
  signups: {
    last7Days: SignupUser[];
    last15Days: SignupUser[];
    last30Days: SignupUser[];
  };
  contactUsFormUsers: {
    last7Days: ContactUsUser[];
    last15Days: ContactUsUser[];
    last30Days: ContactUsUser[];
  };
  inquiryPerformers: {
    last7Days: InquiryPerformer[];
    last15Days: InquiryPerformer[];
    last30Days: InquiryPerformer[];
  };
}

export type TotalOrderDataType = {
  name: string;
  weekNumber: number;
  [productName: string]: number | string; // dynamic keys for product counts
};

export interface LoginUser {
  name: string;
  email: string;
  lastActive: string;
}

export interface SignupUser {
  name: string;
  email: string;
  daysSinceSignup: number;
}

export interface ContactUsUser {
  name: string;
  email: string;
  lastContact: string;
}

export interface InquiryPerformer {
  name: string;
  email: string;
  last7Days: number;
  last15Days: number;
  last30Days: number;
}


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
export type Distributor = {
  _id: string;
  distributorName: string;
  State: string;
  salesperson1: string;
  salesperson2: string;
  salesperson3: string;
  Status?: string;
};



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


