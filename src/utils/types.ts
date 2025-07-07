import { recentActivityButtons } from "./constants";
export type AppUserDataType = {
    name: 'Active User' | 'Total User';
    value: number;
};

export type InquiryDataType = {
    name: string; // e.g., 'Week 1'
    inquiries: number;
};

export type TotalOrderDataType = {
    name: string;
    Abc: number;
    Xyz: number;
};

export type RecentActivityType = typeof recentActivityButtons[number];