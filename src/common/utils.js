export const handleScrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

export function toFieldName(key) {
  return key
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .map((s) => s.charAt(0).toLowerCase() + s.slice(1))
    .join(".");
}

export function toUtcIso(value, endOfDay = false) {
  if (!value) return undefined;
  const d = new Date(
    value.length === 10 // "YYYY-MM-DD" from <input type="date">
      ? `${value}T${endOfDay ? "23:59:59.999" : "00:00:00"}`
      : value, // datetime-local or full ISO
  );
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

export function convertSpotToLetter(spot) {
  switch (spot) {
    case 0:
      return "A";
    case 1:
      return "B";
    case 2:
      return "C";
    case 3:
      return "D";
  }
}

export function convertState(state) {
  switch (state) {
    case 0:
      return "Scheduled";
    case 1:
      return "InProgress";
    case 2:
      return "Completed";
    case 3:
      return "Cancelled";
  }
}

export function showDateTime(dateTime)
{
    const d = new Date(dateTime);

    const dateSection = d.toLocaleDateString("en-GB", {
      dateStyle: "medium",
    });

     const timeSection = d.toLocaleTimeString([], {
       hour: "2-digit",
       minute: "2-digit",
       hour12:false
     });

  return `${dateSection} ${timeSection}`
}

export function timeOnly(dateTimeString)
{
  const dateTime = new Date(dateTimeString);

   const timeSection = dateTime.toLocaleTimeString(undefined, {
     hour: "2-digit",
     minute: "2-digit",
     hour12: false,
   });

   return timeSection;
}