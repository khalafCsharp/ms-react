import { laborsQuery, scheduleQuery } from "../queries";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ScheduleTable from "../components/ScheduleTable";
import AppointmentModal from "../components/AppointmentModal";

export default function Schedule() {
  const [slot, setSlot] = useState(null);
  const [formType, setFormType] = useState("");

  const [date, setDate] = useState(new Date().toLocaleDateString("en-CA"));
  const [laborId, setLaborId] = useState(null);

  const { data: labors = [] } = useQuery(laborsQuery);

  const query = useQuery(scheduleQuery(date, laborId));

  useEffect(() => {
    slot
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "auto");
  }, [slot]);

  if (query.isLoading) {
    return <p> loading</p>;
  } else if (query.isError) {
    return <p> error</p>;
  }

  return (
    <section className="grid gap-2 px-2">
      <div className="flex gap-1 items-center bg-background p-2">
        <div className="w-2 h-18 bg-border rounded-lg"></div>
        <div className="pl-2">
          <h1 className="text-2xl  uppercase font-semibold text-text mb-1">
            Daily Schedule
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input
          className="outline-none h-2 text-text block p-6  transition-all duration-200 rounded-md text-lg bg-background-light   w-full min-w-12 "
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <select
          name=""
          className=" outline-none text-text p-3  transition-all duration-200 rounded-md text-lg bg-background-light"
          id=""
          value={laborId}
          onChange={(e) => setLaborId(e.target.value)}
        >
          <option value="">All</option>

          {labors.map((l) => (
            <option key={l.laborId} value={l.laborId}>
              {l.name}{" "}
            </option>
          ))}
        </select>
      </div>
      <div className="">
        <ScheduleTable
          setSlot={setSlot}
          setFormType={setFormType}
          date={date}
          spots={query.data.spots}
        />
      </div>
      {slot !== null && <AppointmentModal closePortal={()=>setSlot(null)} formType={formType} slot={slot} />}
    </section>
  );
}

