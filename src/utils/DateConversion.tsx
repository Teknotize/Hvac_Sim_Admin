const formatDateTime = (isoString: string) => {
    const dateObj = new Date(isoString);
  
    if (isNaN(dateObj.getTime())) {
    return { date: "N/A", time: "" };
  }

    // Format date as "Month DD, YYYY"
    const date = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  
    // Format time as "HH:MM AM/PM"
    const time = dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  
    return { date, time };
  };
  
  export default formatDateTime;  