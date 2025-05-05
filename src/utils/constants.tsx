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
    name: "Download Manuals",
    checked: false,
    cssClass: "clr-pink",
  },
  {
    id: 4,
    name: "Product Inquiry ",
    checked: false,
    cssClass: "clr-skyblue",
  },
];

export const defaultDate = {
  startDate: new Date(),
  endDate: addDays(new Date(), 0),
  key: "selection",
};
