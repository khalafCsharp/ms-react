import { convertSpotToLetter } from "@/common/utils";
import { useCurrentTime } from "../hooks/useCurrentTime";
import Slot from "./Slot";
import { useEffect, useRef } from "react";

const SLOT_HEIGHT = 50;
const DAY_HEIGHT = 96 * SLOT_HEIGHT;

function ScheduleTable({ setFormType, setSlot, date, spots }) {
  const currentTimeEl = useRef(null)

  const currentTime = useCurrentTime();
  const dayStart = new Date(`${date}T00:00:00`);
  const dayEnd = new Date(dayStart);

  dayEnd.setDate(dayStart.getDate() + 1);

  const total = dayEnd - dayStart;

  const percentage = (d) => ((new Date(d) - dayStart) / total) * 100;

  const isToday = currentTime >= dayStart && currentTime < dayEnd;

useEffect(() => {
  currentTimeEl.current?.scrollIntoView({
    block: "center",
    behavior: "smooth",
  });
}, []);
  return (
    <div>
      <div className="scrollbar-gutter-stable bg-background px-2 py-3 text-5xl grid grid-cols-4 gap-2">
        {spots.map((spot) => (
          <h1 key={spot.spot} className="text-center text-2xl font-bold">
            {convertSpotToLetter(spot.spot)}
          </h1>
        ))}
      </div>
      <div
        className="relative grid grid-cols-4 gap-2"
        style={{ height: DAY_HEIGHT }}
      >
        {spots.map((spot, index) => (
          <div key={index} className="bg-background-light relative">
            {spot.slots.map((slot) => (
              <Slot
                setSlot={setSlot}
                setFormType={setFormType}
                key={slot.startAtUtc}
                percentage={percentage}
                slot={slot}
                currentTime={currentTime}
              />
            ))}
          </div>
        ))}
        {isToday && (
          <div
          ref={currentTimeEl}
            className="absolute inset-x-0 h-0.5 bg-green-500 z-10 pointer-events-none"
            style={{ top: `${percentage(currentTime)}%` }}
          >
            <span className="absolute -left-1 -top-1 size-2.5 rounded-full bg-green-500" />
          </div>
        )}
      </div>
    </div>
  );
}

export default ScheduleTable;
