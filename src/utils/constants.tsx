import { addDays } from "date-fns";
import { AppUserDataType } from "./types";
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
