import { convertSpotToLetter } from "@/common/utils";
import AppointmentState from "./AppointmentState";
import ShowServices from "./ShowServices";
import AppointmentDateTime from "./AppointmentDateTime";
import { ClipboardPlus, Info, ReceiptText } from "lucide-react";
import { useNavigate } from "react-router";
import useHasRole from "@/features/identity/hooks/useHasRole";
import { useMutation } from "@tanstack/react-query";
import { createInvoice } from "../appointmentApi";
import toast from "react-hot-toast";
import { queryClient } from "@/common/queryClient";

function AppointmentRow({ appointment }) {
  const navigate = useNavigate();

  const isManager = useHasRole("Manager");

  const createInvoiceMutation = useMutation({
    mutationFn: (workOrderId) => createInvoice(workOrderId),
    onSuccess: (invoice) => {
      toast.success("invoice created successfully.");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      navigate(`/invoicedetails/${invoice.invoiceId}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.title ?? "failed to create invoice");
    },
  });

  function handleCreateInvoiceClick() {
    createInvoiceMutation.mutate(appointment.workOrderId);
  }

  return (
    <tr className="border border-border odd:bg-background-dark text-center">
      <td>{`${appointment.vehicle.make} ${appointment.vehicle.model} ${appointment.vehicle.licensePlate}`}</td>
      <td className="p-2">{appointment.customer}</td>
      <td className="p-2">{convertSpotToLetter(appointment.spot)}</td>
      <td className="p-2">{appointment.labor}</td>
      <td className="p-2">
        <ShowServices services={appointment.repairTasks} />
      </td>
      <td className="p-2">
        <AppointmentState state={appointment.state} />
      </td>
      <td className="px-2">
        <AppointmentDateTime
          startDate={appointment.startAtUtc}
          endDate={appointment.endAtUtc}
        />
      </td>
      <td className="">
        <div className="p-2 flex justify-around items-center  ">
          <button
            onClick={() => {
              navigate(`/appointmentlist/${appointment.workOrderId}`);
            }}
          >
            <Info className="size-10 text-info" />
          </button>

          {appointment.state === 2 ? (
            appointment.invoiceId ? (
              <button
                disabled={!isManager}
                onClick={() => {
                  navigate(`/invoicedetails/${appointment.invoiceId}`);
                }}
              >
                <ReceiptText className="size-10 " />
              </button>
            ) : (
              <button
                disabled={!isManager || createInvoiceMutation.isPending}
                onClick={handleCreateInvoiceClick}
              >
                <ClipboardPlus className="size-10 " />
              </button>
            )
          ) : null}
        </div>
      </td>
    </tr>
  );
}

export default AppointmentRow;
