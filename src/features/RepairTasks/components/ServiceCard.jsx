import { Clock, EllipsisVertical, Trash } from "lucide-react";
import { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/common/queryClient";
import toast from "react-hot-toast";
import { deleteRepairTask } from "../repairTaskApi";
import EditService from "./EditService";
import useHasRole from "@/features/identity/hooks/useHasRole";

function ServiceCard({ task, onEditClick }) {
  const [isOptionsContextOpen, setIsOptionsContextOpen] = useState(false);
    const isManager = useHasRole("Manager");

  const taskParts = task.repairTaskParts.map((p) => (
    <PartCard key={p.partId} part={p} />
  ));

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteRepairTask(id),
    onSuccess: () => {
      toast.success("service deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setIsOptionsContextOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail ?? error.response?.data?.title);
    },
  });

  function deleteClickHandler() {
    deleteMutation.mutate(task.repairTaskId);
  }
  return (
    <div className="card">
      <div className="mb-4">
        <h1 className="text-3xl text-text ">{task.name}</h1>
        <button
          disabled={!isManager}
          title={!isManager ? "Manager specific actions" : undefined}
          onClick={() => setIsOptionsContextOpen(!isOptionsContextOpen)}
          className={`absolute rounded-xl right-2 top-2 p-2 hover:bg-background-dark transition-all duration-200 ${!isManager ? "cursor-not-allowed" : ""}`}
        >
          <EllipsisVertical className="size-8" />
        </button>
        {/* the edit, delete menu container */}
        <div
          className={`absolute w-30 h-30 text-text  p-2 rounded-md bg-gray-300 right-2 top-14 flex justify-around flex-col gap-2 after:border-8 after:border-x-transparent after:border-t-transparent after:border-b-gray-300 after:absolute after:right-4 after:-top-4 after:size-4 ${isOptionsContextOpen ? "block" : "hidden"}`}
        >
          <EditService
            onClick={() => {
              onEditClick();
              setIsOptionsContextOpen(false);
            }}
          />

          <button
            onClick={deleteClickHandler}
            className="p-2 rounded-md transition-all duration-200 hover:bg-danger/80 bg-danger flex justify-around items-center"
          >
            <Trash /> <span>Delete</span>
          </button>
        </div>
      </div>
      <p className="mb-1 flex gap-2">
        <span>
          <Clock />
        </span>
        <span>{task.taskDurationInMinutes} Minutes</span>
      </p>
      <div className="flex justify-center  items-center gap-8">
        <p className="flex flex-col gap-2">
          <span> Labor-Cost</span>
          <span className="text-2xl font-bold">
            <span className="">$</span>
            {task.laborCost}
          </span>
        </p>
        <p className="flex flex-col gap-2">
          <span>Total-Cost</span>
          <span className="text-2xl font-bold">
            <span className="">$</span>
            {task.totalCost}
          </span>
        </p>
      </div>
      <hr className="my-2 text-gray-400" />
      <div className="text-md mt-4 mb-1 flex justify-between items-center">
        <p>
          <span>parts</span>
          <span>({task.repairTaskParts.length})</span>
        </p>
        <p className="text-black rounded-full px-4 py-2 text-center bg-gray-300">
          <span>$</span>
          <span>
            {task.repairTaskParts.reduce((accumulator, part) => {
              return accumulator + part.quantity * part.cost;
            }, 0)}
          </span>
        </p>
      </div>
      <div className="grid gap-2">
        <div className="grid gap-2">{taskParts}</div>
      </div>
    </div>
  );
}

export default ServiceCard;

function PartCard({ part }) {
  return (
    <div className="flex justify-between gap-3 px-2  py-2">
      <span className="uppercase">{part.name} </span>
      <div className="flex gap-4">
        {" "}
        <span>{part.quantity} </span>
        <span>X </span>
        <span>${part.cost} </span>
      </div>
    </div>
  );
}
