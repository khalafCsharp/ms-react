import { useMutation } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useState } from "react";
import { updateAppointmentState } from "../../appointmentApi";
import toast from "react-hot-toast";
import { queryClient } from "@/common/queryClient";

function UpdateState({ slot, closePortal }) {
  const [appointmentState, setAppointmentState] = useState(slot.state);

  console.log("type of appointmentState:  ",typeof(appointmentState))
  const [updateError, setUpdateError] = useState("");

  const progressMap = { 0: 10, 1: 40, 2: 75, 3: 100 };
  const progressPercentage = progressMap[appointmentState] || 0;

  const updateStateMutation = useMutation({
    mutationFn: ({ newState, workOrderId }) =>
      updateAppointmentState(newState, workOrderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("state updated successfully");
      closePortal();
    },
    onError: (error) => {
      setUpdateError(
        error.response?.data?.detail ??
          error.response?.data?.title ??
          "an error happened during updating state, try again later",
      );
    },
  });

  function handleProcess() {
    console.log("appointmentstate in event handler: ", appointmentState);
    updateStateMutation.mutate({
      newState:appointmentState,
      workOrderId: slot.workOrderId,
    });
  }

  return (
    <div className="p-2 lg:min-w-150 grid gap-2">
      <div className=" relative  grid place-items-center py-8 border border-border-dark">
        <div className=" w-full bg-gray-200 h-2 rounded-full overflow-hidden my-6">
          <div
            className=" bg-green-400 h-2"
            type="progress"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between w-full px-4">
          <span>Scheduled</span>
          <span>In-Progress</span>
          <span>Completed</span>
          <span>Canceled</span>
        </div>
        <button
          className="border-2 border-green-400 bg-background-light-opaque p-4 -translate-x-1/2 absolute top-2/5 -translate-y-1/2 rounded-3xl  text-green-400 cursor-not-allowed"
          style={{ left: `9%` }}
          disabled
        >
          <Check />
        </button>
        <button
          //inprogress
          className={`border-2 border-border bg-background-light-opaque p-4 -translate-x-1/2 absolute top-2/5 -translate-y-1/2 rounded-3xl ${appointmentState === 1 || appointmentState === 2 ? "text-green-400 border-green-400" : ""}`}
          style={{ left: `37%` }}
          onClick={() => setAppointmentState(1)}
        >
          <Check />
        </button>
        <button
          //completed
          className={`border-2 border-border bg-background-light-opaque p-4 -translate-x-1/2 absolute top-2/5 -translate-y-1/2 rounded-3xl ${appointmentState=== 2 ? "text-green-400  border-green-400" : ""} ${appointmentState === 0 || appointmentState === 3 ? "cursor-not-allowed" : ""}`}
          style={{ left: `65%` }}
          onClick={() => setAppointmentState(2)}
          disabled={appointmentState ===0 || appointmentState ===3}
        >
          <Check />
        </button>

        <button
          //cancelled
          className={`border-2 border-border bg-background-light-opaque p-4 -translate-x-1/2 absolute top-2/5 -translate-y-1/2 rounded-3xl  ${appointmentState === 3 ? "text-green-400  border-green-400" : ""}`}
          style={{ left: `91%` }}
          onClick={() => setAppointmentState(3)}
        >
          <Check />
        </button>
      </div>
      <p className="text-danger whitespace-nowrap">{updateError}</p>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => closePortal()}
          className="border border-border rounded-lg px-2"
        >
          Cancel
        </button>
        {(slot.state === 0 || slot.state ===1) && (
          <button onClick={handleProcess} className="primary-button">
            Process
          </button>
        )}
      </div>
    </div>
  );
}

export default UpdateState;
