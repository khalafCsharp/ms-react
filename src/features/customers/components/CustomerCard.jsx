import { Mail, Phone, EllipsisVertical, Trash } from "lucide-react";
import { useState } from "react";

import EditCustomer from "./EditCustomer";
import { useMutation } from "@tanstack/react-query";
import { deleteCustomer } from "../customerApi";
import { queryClient } from "@/common/queryClient";
import toast from "react-hot-toast";
import useHasRole from "@/features/identity/hooks/useHasRole";


function CustomerCard({ customer, onEditClick }) {
  const isManager = useHasRole("Manager");

  const [isOptionsContextOpen, setIsOptionsContextOpen] = useState(false);

  const customerVehicles = customer.vehicleDtos.map((v) => (
    <VehicleCard key={v.vehicleId} vehicle={v} />
  ));

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteCustomer(id),
    onSuccess: () => {
      toast.success("customer delete successfully");
      setIsOptionsContextOpen(false);
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },

    onError: (error) => toast.error(error.response.data?.detail ?? error.response.data?.title ?? "something went wrong, Delete failed"),
  });

  function deleteClickHandler() {
    deleteMutation.mutate(customer.customerId);
  }
  return (
    // card div
    <div className="card">
      <div className="mb-4">
        <h1 className="text-3xl text-text ">{customer.name}</h1>
        <button
          disabled={!isManager}
          title={!isManager ? "Manager specific actions" : undefined}
          onClick={() => setIsOptionsContextOpen(!isOptionsContextOpen)}
          className={`absolute rounded-xl right-2 top-2 p-2 hover:bg-background-dark transition-all duration-200 ${!isManager ? "cursor-not-allowed" : ""}`}
        >
          <EllipsisVertical className="size-8" />
        </button>

        <div
          className={`absolute w-30 h-30 text-text  p-2 rounded-md bg-gray-300 right-2 top-14 flex justify-around  flex-col gap-2 after:border-8 after:border-x-transparent after:border-t-transparent after:border-b-gray-300 after:absolute after:right-4 after:-top-4 after:size-4 ${isOptionsContextOpen ? "block" : "hidden"}`}
        >
          <EditCustomer
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
          <Mail />
        </span>
        <span>{customer.email}</span>
      </p>
      <p className="flex gap-2">
        <span>
          <Phone />
        </span>
        <span>{customer.phoneNumber}</span>
      </p>
      <hr className="my-2 text-gray-400" />
      <div className="text-md mt-4 mb-1 flex justify-between items-center">
        <p>vehicles</p>
        <p className=" rounded-full px-3 py-1 text-center bg-gray-300 text-black">
          {customer.vehicleDtos.length}
        </p>
      </div>
      <div className="grid gap-2">
        <div className="grid gap-2">{customerVehicles}</div>
      </div>
    </div>
  );
}

export default CustomerCard;

function VehicleCard({ vehicle }) {
  return (
    <div className="flex gap-3 px-2 border border-border-dark py-2">
      <span className="uppercase">{vehicle.make}</span>
      <span className="uppercase">{vehicle.model}</span>
      <span>{vehicle.year}</span>
      <span>{vehicle.licensePlate}</span>
    </div>
  );
}
