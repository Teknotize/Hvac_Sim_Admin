import { addDays } from "date-fns";

export const tags = [
  {
    id: 1,
    name: "App User",
    checked: false,
  },
  {
    id: 2,
    name: "Contact Us",
    checked: false,
  },
  {
    id: 3,
    name: "Download Manuals",
    checked: false,
  },
  {
    id: 4,
    name: "Product Inquiry",
    checked: false,
  },
];

export const defaultDate = {
  startDate: new Date(),
  endDate: addDays(new Date(), 0),
  key: "selection",
};
