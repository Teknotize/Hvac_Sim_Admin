import { addDays } from "date-fns";

// const tagColors = ['clr-indigo', 'clr-skyblue', 'clr-darkblue', 'clr-orange', 'clr-green', 'clr-pink'];
export const tags = [
  {
    id: 1,
    name: "App User",
    checked: false,
    cssClass: "clr-indigo",
  },
  {
    id: 2,
    name: "Contact Us Form",
    checked: false,
    cssClass: "clr-orange",
  },
  {
    id: 3,
    name: "Download Manual",
    checked: false,
    cssClass: "clr-pink",
  },
  {
    id: 4,
    name: "Product Inquiry",
    checked: false,
    cssClass: "clr-skyblue",
  },
  {
    id: 5,
    name: "HVAC Excellence",
    checked: false,
    cssClass: "clr-skyblue",
  },
  {
    id: 6,
    name: "HVAC School",
    checked: false,
    cssClass: "clr-skyblue",
  },
  {
    id: 7,
    name: "Distributor",
    checked: false,
    cssClass: "clr-skyblue",
  },
  {
    id: 8,
    name: "MLC",
    checked: false,
    cssClass: "clr-skyblue",
  },
  {
    id: 9,
    name: "GHL",
    checked: false,
    cssClass: "clr-skyblue",
  },
];

export const defaultDate = {
  startDate: new Date(),
  endDate: addDays(new Date(), 0),
  key: "selection",
};
