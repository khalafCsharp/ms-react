import { MoveRight } from "lucide-react";

function AppointmentDateTime({startDate, endDate}) {
    const sd = new Date(startDate);
    const ed = new Date(endDate);

    const st = sd.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const et = ed.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const dateSection = sd.toLocaleDateString("en-GB", {
      dateStyle: "medium",
    });
  return (
    <div className="flex items-center justify-around py-2 border  border-border">
      <span>{dateSection}</span>
      <span className="bg-background-light px-1 rounded-lg">{st}</span>
      <span>
        <MoveRight />
      </span>
      <span className="bg-background-light px-1 rounded-lg">{et}</span>
    </div>
  );
}

export default AppointmentDateTime