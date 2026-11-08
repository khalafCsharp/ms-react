import { convertSpotToLetter } from "@/common/utils";
import { customerQuery } from "@/features/customers/queries";
import { servicesQuery } from "@/features/RepairTasks/queries";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Clock4, SavePlus, X } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { laborsQuery } from "../../queries";
import { createAppointment } from "../../appointmentApi";
import { queryClient } from "@/common/queryClient";
import toast from "react-hot-toast";
import { DateTime } from "luxon";
import { setServerErrors } from "@/common/apiErrors/setServerErrors";

function CreateAppoinmentForm({ closePortal, slot }) {
  const [chosenCustomerId, setChosenCustomerId] = useState("");

  const cusQuery = useQuery(customerQuery);

  const { data: labors = [] } = useQuery(laborsQuery);

  const selectLaborOptions = labors.map((labor, index) => (
    <option key={index} value={labor.laborId}>
      {labor.name}
    </option>
  ));

  const localStartDate = new Date(slot.startAtUtc);

  const startAtDate = new Date(slot.startAtUtc);

  const luxonDateTime = DateTime.fromJSDate(startAtDate);

  const form = useForm({
    defaultValues: {
      laborId: "",
      spot: slot.spot,
      vehicleId: "",
      startAt: luxonDateTime.toISO(),
      services: [],
    },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "services",
  });

  const selectCustomerOptions = cusQuery.data?.map((customer, index) => (
    <option key={index} value={customer.customerId}>
      {customer.name}
    </option>
  ));

  const selectVehicleOptions = cusQuery.data
    ?.find((customer) => customer.customerId === chosenCustomerId)
    ?.vehicleDtos?.map((v, index) => (
      <option key={index} value={v.vehicleId}>
        {`${v.model} ${v.licensePlate}`}
      </option>
    ));

  const serQuery = useQuery(servicesQuery);

  const selectServicesOptions = serQuery.data?.map((service, index) => (
    <option key={index} value={service.repairTaskId}>
      {service.name}
    </option>
  ));

  const createNewAppointmentMutation = useMutation({
    mutationFn: (newAppointment) => createAppointment(newAppointment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      form.reset();
      toast.success("service created successfully");
      closePortal();
    },
    onError: (error) => {
      console.log("error of creating new appointment:  ", error.data?.title);

      setServerErrors(error, form);
    },
  });

  function addServiceHandler(e) {
    const id = e.target.value;
    if (!id) return;

    const service = serQuery.data?.find(
      (service) => service.repairTaskId === id,
    );

    const alreadyAdded = fieldArray.fields.some(
      (f) => String(f.repairTaskId) === id,
    );

    if (service && !alreadyAdded) {
      fieldArray.append(service);
    }

    e.target.value = "";
  }

  function handleSubmitForm(formData) {
    console.log("form data : ", formData);
    const { services, ...rest } = formData;

    const repairTaskIds = services.map((service) => service.repairTaskId);

    const requestBody = { ...rest, repairTaskIds };
    console.log(
      "the body of reqeust that will be sent to create a new workOrder:  ",
      requestBody,
    );

    createNewAppointmentMutation.mutate(requestBody);
  }

  return (
    <form
      className="border border-border grid gap-2 bg-background px-2 rounded-xl"
      onSubmit={form.handleSubmit(handleSubmitForm)}
    >
      <h2 className="uppercase font-semibold text-center text-3xl p-4">
        New Appointment
      </h2>

      <div className="flex p-2 justify-between items-center border border-border-dark ">
        <div className="text-3xl flex justify-start gap-2">
          <span className="size-8 rounded-2xl bg-green-500"></span>
          <p>{convertSpotToLetter(slot.spot)}</p>
        </div>
        <div className="flex gap-1">
          <Clock4 />
          <p>{localStartDate.toLocaleTimeString()}</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-2 p-2 border border-border-dark">
        <div className="grid">
          <label>customer</label>
          <select
            className="outline-none text-text p-3 transition-all duration-200 rounded-md text-lg bg-background-light "
            onChange={(e) => {
              setChosenCustomerId(e.currentTarget.value);
              form.setValue("vehicleId", "");
            }}
            value={chosenCustomerId}
            name="customer"
            id=""
          >
            <option value="">-- choose a customer --</option>
            {selectCustomerOptions}
          </select>
        </div>
        <div className="grid">
          <label>vehicle</label>
          <select
            {...form.register("vehicleId", {
              required: "you must choose a vehicle",
            })}
            disabled={chosenCustomerId === ""}
            className="outline-none text-text p-3  transition-all duration-200 rounded-md text-lg bg-background-light "
          >
            <option value="">-- choose a vehicle --</option>
            {selectVehicleOptions}
          </select>
        </div>
        <p className="text-danger">
          {form.formState.errors?.vehicleId &&
            form.formState.errors.vehicleId.message}
        </p>
      </div>
      <div className="grid p-2 border border-border-dark">
        {" "}
        <label>choose a labor</label>
        <select
          {...form.register("laborId", {
            required: "you must appoint a labor",
          })}
          className="outline-none text-text p-3  transition-all duration-200 rounded-md text-lg bg-background-light "
        >
          <option value="">-- choose a labor --</option>
          {selectLaborOptions}
        </select>
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
          {fieldArray.fields.map((field, index) => (
            <li
              key={field.id}
              className="flex justify-start gap-2 border border-border-dark items-center"
            >
              <span className="p-2 rounded-md bg-background-light">
                {field.name}
              </span>
              <span className="p-2 rounded-md bg-background-light">
                {field.taskDurationInMinutes}min
              </span>
              <button type="button" onClick={() => fieldArray.remove(index)}>
                <X />
              </button>
            </li>
          ))}
        </ul>
      </div>
      {form.formState.errors.root?.server && (
        <p className="text-danger">
          {form.formState.errors.root.server.message}
        </p>
      )}

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
          type="submit"
          className="flex justify-center items-center gap-1 p-2 rounded-lg bg-primary border border-border-dark"
        >
          <SavePlus />
          <span>Save</span>
        </button>
      </div>
    </form>
  );
}

export default CreateAppoinmentForm;
