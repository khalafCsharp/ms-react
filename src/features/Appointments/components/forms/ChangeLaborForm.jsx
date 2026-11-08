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
import { laborsQuery } from "../../queries";
import { useState } from "react";
import toast from "react-hot-toast";
import { assignNewLabor } from "../../appointmentApi";
import { queryClient } from "@/common/queryClient";

function ChangeLaborForm({ slot, closePortal }) {
  const [laborId, setLaborId] = useState("");
  const [error, setError] = useState("")

  const assignNewLaborMutation = useMutation({
    mutationFn:({laborId, workOrderId})=>assignNewLabor(laborId, workOrderId),
    onSuccess:()=>{
      toast.success("new labor assigned successfully")
      queryClient.invalidateQueries(["appointments"])
      queryClient.invalidateQueries(["schedule"])
      closePortal();
    },
    onerror:(error)=>{
     setError(error.response?.data?.title)
    }
  })
  const { data: labors = [] } = useQuery(laborsQuery);
  console.log("slot in change labor modal:  ", slot);

  function handleProcess()
  {
    if(laborId === slot.labor.laborId)
    {
      setError("You cannot choose the current user again.")
      return ;
    }
    assignNewLaborMutation.mutate({laborId,workOrderId:slot.workOrderId})
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
            <CarFront />
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
          value={laborId}
          onChange={(e) => setLaborId(e.target.value)}
        >
          <option value="">-- Choose a New Labor --</option>

          {labors.map((l) => (
            <option key={l.laborId} value={l.laborId}>
              {l.name}{" "}
            </option>
          ))}
        </select>
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

export default ChangeLaborForm;
