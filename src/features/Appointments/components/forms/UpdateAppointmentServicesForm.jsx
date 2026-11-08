import { timeOnly } from "@/common/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CarFront,
  MoveRight,
  SavePlus,
  Timer,
  Toolbox,
  UserCheck,
  X,
} from "lucide-react";
import { useState } from "react";
import { updateAppointmentServices } from "../../appointmentApi";
import toast from "react-hot-toast";
import { queryClient } from "@/common/queryClient";
import { servicesQuery } from "@/features/RepairTasks/queries";

function UpdateAppointmentServicesForm({ slot, closePortal }) {
  const [error, setError] = useState("");
  const [choosenServices, setChoosenServices] = useState([...slot.repairTasks]);

  const serQuery = useQuery(servicesQuery);

  const selectServicesOptions = serQuery.data?.map((service, index) => (
    <option key={index} value={service.repairTaskId}>
      {service.name}
    </option>
  ));

  const updateAppointmentServicesMutation = useMutation({
    mutationFn: ({ appointmentId, repairTaskIds }) =>
      updateAppointmentServices(appointmentId, repairTaskIds),
    onSuccess: () => {
      toast.success("services updated successfully");
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });

      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
      closePortal();
    },
    onError: (error) => {
      setError(error.response?.data?.title);
    },
  });

  function addServiceHandler(e) {
    const id = e.target.value;
    if (!id) return;

    const service = serQuery.data?.find(
      (service) => service.repairTaskId === id,
    );

    const alreadyAdded = choosenServices.some(
      (service) => String(service.repairTaskId) === id,
    );

    if (service && !alreadyAdded) {
      // choosenServices.push(service);
      setChoosenServices((prev) => [...prev, service]);
    }

    e.target.value = "";
  }

  function handleProcess() {
    const repairTaskIds = choosenServices.map((s) => s.repairTaskId);
    updateAppointmentServicesMutation.mutate({
      appointmentId: slot.workOrderId,
      repairTaskIds,
    });
  }

  //jsx
  return (
    <section className="border border-border grid gap-2 bg-background px-2 rounded-xl">
      <h2 className="uppercase font-semibold text-center text-3xl p-4">
        Update Appointment Services
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
            <CarFront />
            <p className="font-light">Vehicle:</p>
            <p className="font-bold">{slot.vehicle}</p>
          </div>
        </div>
      </div>
      <div className="grid p-2 border border-border-dark">
        <label>services</label>
        <select
          className="outline-none text-text p-3  transition-all duration-200 rounded-md text-lg bg-background-light mb-2"
          onChange={addServiceHandler}
        >
          <option value="">-- add services --</option>
          {selectServicesOptions}
        </select>

        <ul className="flex flex-col border border-border-dark  gap-1">
          {choosenServices.map((service, index) => (
            <li
              key={index}
              className="flex justify-start gap-2 border border-border-dark items-center"
            >
              <span className="p-2 rounded-md bg-background-light">
                {service.name}
              </span>
              <span className="p-2 rounded-md bg-background-light">
                {service.taskDurationInMinutes}min
              </span>
              <button
                type="button"
                onClick={() => {
                  setChoosenServices((prev) =>
                    prev.filter((s, i) => i !== index),
                  );
                }}
              >
                <X />
              </button>
            </li>
          ))}
          {/* onClick={() => fieldArray.remove(index)} */}
        </ul>
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

export default UpdateAppointmentServicesForm;
