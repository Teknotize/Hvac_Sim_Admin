import { addDays } from "date-fns";
import { AppUserDataType,InquiryDataType,TotalOrderDataType } from "./types";
export const tags = [ 
  {
    id: 1,
    name: "App User",
    checked: false,
    cssClass: "clr-indigo",       // from "app-user"
  },
  {
    id: 2,
    name: "Contact Us Form",
    checked: false,
    cssClass: "clr-orange",       // from "contact-us-form"
  },
  {
    id: 3,
    name: "Download Manual",
    checked: false,
    cssClass: "clr-pink",         // from "download-manual"
  },
  {
    id: 4,
    name: "Product Inquiry",
    checked: false,
    cssClass: "clr-skyblue",      // from "product-inquiry"
  },
  {
    id: 5,
    name: "HVAC Excellence",
    checked: false,
    cssClass: "clr-vividgreen",   // from "hvac-excellence"
  },
  {
    id: 6,
    name: "HVAC School",
    checked: false,
    cssClass: "clr-cyan",         // from "hvac-school"
  },
  {
    id: 7,
    name: "Distributor",
    checked: false,
    cssClass: "clr-olive",        // from "distributor"
  },
  {
    id: 8,
    name: "MLC",
    checked: false,
    cssClass: "clr-violet",       // from "mlc"
  },
  {
    id: 9,
    name: "GHL",
    checked: false,
    cssClass: "clr-teal",         // from "ghl"
  },
];


export const defaultDate = {
  startDate: new Date(),
  endDate: addDays(new Date(), 0),
  key: "selection",
};

export const   stats = [
    { name: 'Distributors', value: 8 ,subText:"open",till: "2023-10-01",color:"text-blue-500"},
    { name: 'Sales Persons', value: 24, subText:"Lorem Ipsium",till: "2023-10-01",color:"text-yellow-500"},
    { name: 'Inquiries', value: 15 ,subText:"open",till: "2023-10-01",color:"text-red-700"},
    { name: 'Active Users', value: 63 ,subText:"Lorem Ipsium",till: "2023-10-01",color:"text-teal-700"},
  ];

  

export const tempAppUserData: AppUserDataType[] = [
  
  { name: 'Total User', value: 400 },
  { name: 'Active User', value: 100 },
];
export const tempInquiriesData: InquiryDataType[] = [
  { name: 'Week 1', inquiries: 18500 },
  { name: 'Week 2', inquiries: 42000 },
  { name: 'Week 3', inquiries: 27800 },
  { name: 'Week 4', inquiries: 36000 },
  { name: 'Week 5', inquiries: 24500 },
  { name: 'Week 6', inquiries: 40000 },
  { name: 'Week 7', inquiries: 19800 },
  { name: 'Week 8', inquiries: 33200 },
  { name: 'Week 9', inquiries: 28900 },
  { name: 'Week 10', inquiries: 37000 },
];


export const tempTotalOrdersData: TotalOrderDataType[] = [
  {
    name: 'Week 1',
    Abc: 120000,
    Xyz: 100000,
    Pqr: 140000,
    Lmn: 180000,
    Def: 160000,
    Ghi: 200000
  },
  {
    name: 'Week 2',
    Abc: 180000,
    Xyz: 130000,
    Pqr: 210000,
    Lmn: 170000,
    Def: 220000,
    Ghi: 150000
  },
  {
    name: 'Week 3',
    Abc: 220000,
    Xyz: 500000,
    Pqr: 300000,
    Lmn: 260000,
    Def: 190000,
    Ghi: 240000
  },
  {
    name: 'Week 4',
    Abc: 200000,
    Xyz: 80000,
    Pqr: 90000,
    Lmn: 150000,
    Def: 170000,
    Ghi: 130000
  },
  {
    name: 'Week 5',
    Abc: 150000,
    Xyz: 120000,
    Pqr: 180000,
    Lmn: 140000,
    Def: 160000,
    Ghi: 190000
  }
];
export const recentActivityButtons = [
  { label: "App Users", active: true },
  { label: "Contact us", active: false },
  { label: "Inquiries", active: false },
];
export const TestData = [
      {
        initials: "SP",
        name: "Samuel Patrick",
        email: "samul@example.com",
        time: "3 days ago",
        color: "bg-blue-100 text-blue-700",
      },
      {
        initials: "EM",
        name: "Elijah Matthew",
        email: "elijah@example.com",
        time: "9 days ago",
        color: "bg-gray-200 text-gray-700",
      },
      {
        initials: "EM",
        name: "Noah Benjamin",
        email: "noah@example.com",
        time: "15 days ago",
        color: "bg-red-100 text-red-700",
      },
    ]
