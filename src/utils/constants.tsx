import { addDays } from "date-fns";
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
