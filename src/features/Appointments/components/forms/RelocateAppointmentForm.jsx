import { convertSpotToLetter, timeOnly } from "@/common/utils";
import { useMutation } from "@tanstack/react-query";
import {
  MoveRight,
  SavePlus,
  Timer,
  Toolbox,
  UserCheck,
  X,
} from "lucide-react";
import { useState } from "react";
import { relocateAppointment } from "../../appointmentApi";
import { DateTime } from "luxon";
import toast from "react-hot-toast";
import { queryClient } from "@/common/queryClient";

const spots = [0, 1, 2, 3];

function RelocateAppointmentForm({ slot, closePortal, startDateTime }) {
  const [error, setError] = useState("");
  const [newDate, setNewDate] = useState(() =>
    startDateTime.toLocaleDateString("en-CA"),
  );
  const [newTime, setNewTime] = useState(() =>
    startDateTime.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  );
  const [spot, setSpot] = useState(slot.spot);


  const relocateAppointmentMutation = useMutation({
    mutationFn: ({workOrderId,body}) => relocateAppointment(workOrderId,body),
    onSuccess:()=>{
      toast.success("appointment relocated successfully")
      queryClient.invalidateQueries(["appointments"])
      queryClient.invalidateQueries(["schedule"])
      closePortal()
    },
    onError:(error)=>{
      setError(error.response.data?.title)
    }
  });

  function handleProcess() {
   
    const combinedDateTime = DateTime.fromISO(`${newDate}T${newTime}`);

    // 2. Output as a complete ISO 8601 string including the offset
    const dateTimeOffsetPayload = combinedDateTime.toISO();
  
      const body = { newStartAtUtc :dateTimeOffsetPayload, newSpot:Number(spot)};

    relocateAppointmentMutation.mutate({workOrderId:slot.workOrderId, body});
  }
  function handleTimeChange(e) {
    const inputValue = e.target.value; // e.g., "14:23"
    if (!inputValue) return;

    // 1. Parse the input string into a temporary Luxon object
    const timeObj = DateTime.fromFormat(inputValue, "HH:mm");

    // 2. Calculate the closest 15-minute slot (0, 15, 30, 45)
    const minutes = timeObj.minute;
    const remainder = minutes % 15;

    // Round to nearest quarter hour
    let roundedMinutes =
      remainder >= 8 ? minutes + (15 - remainder) : minutes - remainder;

    let finalTimeObj = timeObj.set({ minute: roundedMinutes });

    // Handle edge case if rounding pushes minutes to 60 (Luxon increments the hour safely)
    if (roundedMinutes === 60) {
      finalTimeObj = timeObj.plus({ hours: 1 }).set({ minute: 0 });
    }

    // 3. Update the state with the strictly formatted "HH:mm" string
    setNewTime(finalTimeObj.toFormat("HH:mm"));
  }

  return (
    <section className="border border-border grid gap-2 bg-background px-2 rounded-xl">
      <h2 className="uppercase font-semibold text-center text-3xl p-4">
        Assign New Labor
      </h2>
      <div className="p-1 border border-border-dark grid gap-1">
        <div className="p-4 border border-border-dark shadow-md rounded-md w-xl flex flex-wrap justify-between items-center ">
          <div className="flex justify-center items-center gap-1">
            <Toolbox />
            <p className="font-light">WorkOrder:</p>
            <p className="font-bold">{slot.workOrderId.slice(0, 8)}</p>
          </div>
          <div className="flex justify-start items-center gap-1">
            <Timer />
            <p className="font-light">Time:</p>
            <p className="font-bold flex justify-center gap-1">
              <span>{timeOnly(slot.startAtUtc)}</span> <MoveRight />{" "}
              <span>{timeOnly(slot.endAtUtc)}</span>
            </p>
          </div>
        </div>
        <div className="p-4 border border-border-dark shadow-md rounded-md w-xl flex flex-wrap justify-between items-center ">
          <div className="flex justify-center items-center gap-1">
            <UserCheck />
            <p className="font-light">Current labor:</p>
            <p className="font-bold">{slot.labor.name}</p>
          </div>
          <div className="flex justify-center items-center gap-1">
            <UserCheck />
            <p className="font-light">Vehicle:</p>
            <p className="font-bold">{slot.vehicle}</p>
          </div>
        </div>
      </div>
      <div className="grid p-2 border border-border-dark">
        <label>choose a labor</label>
        <select
          name=""
          className=" outline-none text-text p-3  transition-all duration-200 rounded-md text-lg bg-background-light"
          id=""
          value={spot}
          onChange={(e) => setSpot(e.target.value)}
        >
          {spots.map((s, index) => (
            <option key={index} value={s}>
              {convertSpotToLetter(s)}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 p-2 border border-border-dark">
        <div className="grid ">
          <label htmlFor="">new date</label>
          <input
            type="date"
            value={newDate}
            className="bg-background-dark p-2 border border-border-dark rounded-md"
            onChange={(e) => setNewDate(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 p-2 border border-border-dark">
        <div className="grid ">
          <label htmlFor="">new time</label>
          <input
            type="time"
            className="bg-background-dark p-2 border border-border-dark rounded-md"
            value={newTime}
            step="900"
            onChange={(e) => handleTimeChange(e)}
          />
        </div>
      </div>
      <p className="text-danger">{error}</p>
      <div className="mt-4 p-2 border border-border-dark grid gap-2 grid-cols-2 ">
        <button
          type="button"
          onClick={closePortal}
          className="flex justify-center items-center gap-1 p-2 rounded-lg bg-background-dark border border-border-dark"
        >
          <X />
          <span> Cancel</span>
        </button>
        <button
          onClick={handleProcess}
          className="flex justify-center items-center gap-1 p-2 rounded-lg bg-primary border border-border-dark"
        >
          <SavePlus />
          <span>Process</span>
        </button>
      </div>
    </section>
  );
}

export default RelocateAppointmentForm;
