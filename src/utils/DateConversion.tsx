const formatDateTime = (isoString:string) => {
  const dateObj = new Date(isoString);
  if (isNaN(dateObj.getTime())) {
    return { date: "N/A", time: "" };
  }
  const date = dateObj.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const time = dateObj.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return { date, time };
};

  export default formatDateTime;  