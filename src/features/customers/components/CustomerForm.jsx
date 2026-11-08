import { useFieldArray, useForm } from "react-hook-form";
import { Trash, Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/common/queryClient";
import { editCustomer } from "../customerApi";
import { createCustomer } from "../customerApi";
import toast from "react-hot-toast";
import { setServerErrors } from "@/common/apiErrors/setServerErrors";

function CustomerForm({ setIsPortalOpen, customerToBeEdited = {} }) {
  const { customerId } = customerToBeEdited;

  const isEditSession = Boolean(customerId);

  const form = useForm({
    defaultValues: isEditSession
      ? {
          name: customerToBeEdited.name,
          email: customerToBeEdited.email,
          phoneNumber: customerToBeEdited.phoneNumber,
          vehicles: (customerToBeEdited.vehicleDtos ?? []).map((v) => ({
            vehicleId: v.vehicleId,
            make: v.make,
            model: v.model,
            year: v.year,
            licensePlate: v.licensePlate,
          })),
        }
      : {
          name: "",
          email: "",
          phoneNumber: "",
          vehicles: [
            {
              make: "",
              model: "",
              year: "",
              licensePlate: "",
            },
          ],
        },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "vehicles",
  });

  const editCustomerMutation = useMutation({
    mutationFn: ({ customerId, data }) => editCustomer(customerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      form.reset();
      toast.success("customer updated successfully");
      setIsPortalOpen(false);
    },
    onError: (error) => {
      setServerErrors(error, form);
    },
  });
  const createCustomerMutation = useMutation({
    mutationFn: (newCustomer) => createCustomer(newCustomer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      form.reset();
      toast.success("customer created successfully");
      setIsPortalOpen(false);
    },
    onError: (error) => {
      setServerErrors(error, form);
    },
  });

  function addVehicleHandler() {
    fieldArray.append({make:"",model:"",year:"",licensePlate:""})
  }

  function handleSubmitEvent(formData) {
    const body = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      vehicles: formData.vehicles.map((v) => ({
        vehicleId: v.vehicleId ?? null,
        make: v.make,
        model: v.model,
        year: Number(v.year),
        licensePlate: v.licensePlate,
      })),
    };
    if (isEditSession) {
      editCustomerMutation.mutate({ customerId, data: body });
    } else {
      console.log("body of create customer request:  ", body);
      createCustomerMutation.mutate(body);
    }
  }
  return (
    <form
      action=""
      className="px-2   grid gap-4"
      onSubmit={(e) => {
        form.clearErrors();
        return form.handleSubmit(handleSubmitEvent)(e);
      }}
    >
      <div className="px-8">
        <h2 className="text-text text-center whitespace-nowrap text-2xl">
          {isEditSession ? "Edit Customer" : "Create new Customer"}
        </h2>
      </div>
      <section className="grid gap-2 py-4 px-2 border border-border-dark">
        <div className="flex gap-3 justify-between items-center">
          <label className="w-16" htmlFor="">
            Name
          </label>
          <input
            className="border border-border-dark py-1 rounded-lg outline-none min-w-0 w-full"
            type="text"
            {...form.register("name", { required: "name is required" })}
          />
        </div>
        <p className="text-danger">
          {form.formState.errors?.name && form.formState.errors.name.message}
        </p>
        <div className="flex gap-3 justify-between items-center">
          <label className="w-16" htmlFor="">
            Email
          </label>
          <input
            className="border border-border-dark py-1 rounded-lg outline-none w-full min-w-0"
            type="text"
            {...form.register("email", { required: "email is required" })}
          />
        </div>
        <p className="text-danger">
          {form.formState.errors?.email &&
            form.formState.errors.email.message}{" "}
        </p>
        <div className="flex gap-3 justify-between items-center">
          <label className="w-16" htmlFor="">
            Phone
          </label>
          <input
            className="border border-border-dark py-1 rounded-lg outline-none w-full min-w-0"
            type="text"
            {...form.register("phoneNumber", {
              required: "phone number is required",
            })}
          />
        </div>
        <p className="text-danger">
          {form.formState.errors?.phoneNumber &&
            form.formState.errors.phoneNumber.message}{" "}
        </p>
      </section>

      {/* vehicles section  */}
      <section className="border border-border-dark p-2 grid gap-1">
        <div className="flex justify-between items-center">
          <h3>Vehicles</h3>
          <button
            onClick={addVehicleHandler}
            className="bg-background-light hover:text-primary p-4 border border-border-dark rounded-xl transition-colors duration-200 shadow-custom"
            type="button"
          >
            <Plus />
          </button>
        </div>
        {fieldArray.fields.map((field, index) => (
          <div key={index}>
            <div className="flex justify-between items-center gap-2">
              <div className="flex flex-col gap-2  items-center">
                <input
                  className={`border responsive-input border-border-dark p-1 rounded-lg outline-none  min-w-0 w-full `}
                  type="text"
                  {...form.register(`vehicles.${index}.make`)}
                  placeholder="make"
                />
              </div>
              <div className="flex flex-col  gap-2 items-center">
                <input
                  className={`border responsive-input border-border-dark p-1 rounded-lg outline-none  min-w-0 w-full `}
                  type="text"
                  {...form.register(`vehicles.${index}.model`)}
                  placeholder="model"
                />
              </div>
              <div className="flex flex-col gap-2  items-center">
                <input
                  className={`border responsive-input border-border-dark p-1 rounded-lg outline-none  min-w-0 w-full `}
                  type="number"
                  {...form.register(`vehicles.${index}.year`)}
                  placeholder="year"
                />
              </div>
              <div className="flex flex-col gap-2  items-center">
                <input
                  className={`border responsive-input border-border-dark p-1 rounded-lg outline-none  min-w-0 w-full `}
                  type="text"
                  {...form.register(`vehicles.${index}.licensePlate`)}
                  placeholder="license plate"
                />
              </div>
              <button
                className="bg-red-500 p-2 rounded-xl hover:bg-red-400 transition-all duration-200 ease-in"
                type="button"
                onClick={() => fieldArray.remove(index)}
              >
                <Trash />
              </button>
            </div>
            <div>
              <p className="text-danger">
                {form.formState.errors?.vehicles?.[index]?.make?.message}
              </p>
              <p className="text-danger">
                {form.formState.errors?.vehicles?.[index]?.model?.message}
              </p>
              <p className="text-danger">
                {form.formState.errors?.vehicles?.[index]?.year?.message}
              </p>
              <p className="text-danger">
                {
                  form.formState.errors?.vehicles?.[index]?.licensePlate
                    ?.message
                }
              </p>
            </div>
          </div>
        ))}

        {form.formState.errors.root?.server && (
          <p className="text-danger">
            {form.formState.errors.root.server.message}
          </p>
        )}
      </section>
      <div className="flex justify-end gap-4 items-center">
        <button className="primary-button" type="submit">
          Save
        </button>
        <button
          className="bg-background-light p-4 border border-border-dark rounded-xl transition-transform  hover:-translate-y-0.5 duration-200 shadow-custom"
          onClick={() => {
            setIsPortalOpen(false);
          }}
          type="reset"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default CustomerForm;
