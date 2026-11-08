import { queryClient } from "@/common/queryClient";
import { useMutation } from "@tanstack/react-query";
import {
  LandPlot,
  MoveRight,
  Activity,
  Users,
  Info,
  Trash,
  Pin,
} from "lucide-react";
import toast from "react-hot-toast";
import { deleteAppointment } from "../appointmentApi";

function Slot({ slot, currentTime, percentage, setFormType, setSlot }) {
  const localStart = new Date(slot.startAtUtc);
  const localEnd = new Date(slot.endAtUtc);

  const isPast = localStart < currentTime;

  function handleClick() {
    console.log("slot clicked");
    if (!slot.isOccupied && !isPast) {
      console.log("we are inside the condition");
      setSlot(slot);
      setFormType("newAppointment");
    }
  }

  const deleteAppointmentMutation = useMutation({
    mutationFn: (workOrderId) => deleteAppointment(workOrderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });

      toast.success("appointment deleted successfully");
    },
    onError: (error) => {
      toast.error(error.data?.title);
    },
  });

  function handleDeleteAppointment() {
    console.log("workOrderId of slot to be deleted:  ", slot.workOrderId);
    deleteAppointmentMutation.mutate(slot.workOrderId);
  }

  return (
    <div
      onClick={handleClick}
      className={`group  absolute inset-x-0 hover:bg-background border border-border-dark container rounded-md transition-opacity flex flex-col justify-between px-2 ${
        isPast && !slot.isOccupied ? "opacity-40 pointer-events-none " : ""
      }  ${slot.isOccupied ? "bg-background-dark" : ""}`}
      style={{
        top: `${percentage(localStart)}%`,
        height: `${percentage(localEnd) - percentage(localStart)}%`,
      }}
    >
      <p className="flex justify-start gap-2 items-center">
        <span>{localStart.toLocaleTimeString([], { timeStyle: "short" })}</span>
        <MoveRight />
        <span>{localEnd.toLocaleTimeString([], { timeStyle: "short" })}</span>
      </p>
      {slot.isOccupied && isPast && (
        <div className=" text-lg   py-1  bg-background-light flex  justify-center gap-1">
          <button
            className="border border-border p-2  transition-all hover:text-primary   duration-200 place-items-center"
            title="show appointment details"
            onClick={() => {
              setFormType("showDetails");
              setSlot(slot);
            }}
          >
            <Info />
          </button>

          <button
            className="border border-border bg-background-light  p-2 hover:text-primary transition-all duration-200 place-items-center"
            title="appointment state update"
            onClick={() => {
              setFormType("updateState");
              setSlot(slot);
            }}
          >
            <Activity />
          </button>
        </div>
      )}
      {slot.isOccupied && !isPast && (
        <div className=" text-lg   py-1  bg-background-light flex flex-wrap lg:flex-nowrap justify-center gap-1">
          <button
            className="border border-border bg-background-light   p-2  hover:text-primary transition-all duration-200 place-items-center"
            title="appointment state update"
            onClick={() => {
              setFormType("updateState");
              setSlot(slot);
            }}
          >
            <Activity />
          </button>
          <button
            className="border border-border p-2  transition-all hover:text-primary   duration-200 place-items-center"
            title="appointment details"
            onClick={() => {
              setFormType("showDetails");
              setSlot(slot);
            }}
          >
            <Info />
          </button>
          <button
            className="border border-border p-2  transition-all duration-200 hover:text-primary   place-items-center"
            title="relocate appointment"
            onClick={() => {
              setFormType("relocateAppointment");
              setSlot(slot);
            }}
          >
            <LandPlot />
          </button>
          <button
            className="border hover:text-primary  border-border p-2  transition-all   duration-200 place-items-center"
            title="edit services of appointment"
            onClick={() => {
              setFormType("updateServices");
              setSlot(slot);
            }}
          >
            <Pin />
          </button>
          <button
            onClick={handleDeleteAppointment}
            className="border hover:text-primary  border-border p-2 transition-all  duration-200 place-items-center"
            //todo
            title="delete appointment"
          >
            <Trash />
          </button>
          <button
            className="border hover:text-primary shadow-2xl border-border p-2   transition-all duration-200 place-items-center"
            onClick={() => {
              setFormType("changeLabor");
              setSlot(slot);
            }}
            title="change labor of the appointment"
          >
            <Users />
          </button>
        </div>
      )}
    </div>
  );
}

export default Slot;
