import { useFieldArray, useForm } from "react-hook-form";
import { Trash, Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/common/queryClient";
import toast from "react-hot-toast";
import { createRepairTask, editRepairTask } from "../repairTaskApi";
import serviceDuration from "../serviceDuration";
import { setServerErrors } from "@/common/apiErrors/setServerErrors";

function ServiceForm({ setIsPortalOpen, serviceToBeEdited = {} }) {
  const { repairTaskId } = serviceToBeEdited;

  const isEditSession = Boolean(repairTaskId);

  const form = useForm({
    defaultValues: isEditSession
      ? {
          name: serviceToBeEdited.name,
          estimatedDurationInMins: serviceToBeEdited.taskDurationInMinutes,
          laborCost: serviceToBeEdited.laborCost,
          parts: (serviceToBeEdited.repairTaskParts ?? []).map((p) => ({
            partId: p.partId,
            name: p.name,
            cost: p.cost,
            quantity: p.quantity,
          })),
        }
      : {
          name: "",
          estimatedDurationInMins: 0,
          laborCost: 0,
          totalCost: 0,
          parts: [{partId: null, name: "", cost: 0, quantity: 0 }],
        },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "parts",
  });

  const editServiceMutation = useMutation({
    mutationFn: ({ repairTaskId, editedService }) => editRepairTask(repairTaskId, editedService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      form.reset();
      toast.success("service updated successfully");
      setIsPortalOpen(false);
    },
    onError: (error) => {
      setServerErrors(error, form);
    },
  });

  const createServiceMutation = useMutation({
    mutationFn: (newService) => createRepairTask(newService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      form.reset();
      toast.success("service created successfully");
      setIsPortalOpen(false);
    },
    onError: (error) => {
      
      setServerErrors(error, form);
    },
  });

  function addPartHandler() {
    fieldArray.append({ name: "", cost: 0, quantity: 0 });
  }

  function handleSubmitEvent(formData) {
    const body = {
      name: formData.name,
      estimatedDurationInMins: Number(formData.estimatedDurationInMins),
      laborCost: formData.laborCost,
      parts: formData.parts.map((s) => ({
        partId: s.partId ?? null,
        name: s.name,
        cost: s.cost,
        quantity: s.quantity,
      })),
    };
    if (isEditSession) {
      editServiceMutation.mutate({ repairTaskId, editedService: body });
    } else {
      createServiceMutation.mutate(body);
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
          {isEditSession ? "Edit Service" : "Create new Service"}
        </h2>
      </div>
      <section className="grid gap-2 py-4 px-2 border border-border">
        <div className="flex gap-3 justify-between items-center">
          <label className="w-16" htmlFor="">
            Name
          </label>
          <input
            className="border border-border py-1 rounded-lg outline-none min-w-0 w-full"
            type="text"
            {...form.register("name", { required: "service name is required" })}
          />
        </div>
        <p className="text-danger">
          {form.formState.errors?.name && form.formState.errors.name.message}
        </p>
        <div className="flex gap-3 justify-between items-center">
          <label className="w-16" htmlFor="">
            Labor-Cost
          </label>
          <input
            className="border border-border py-1 rounded-lg outline-none min-w-0 w-full"
            type="number"
            {...form.register("laborCost", {
              required: "service labor cost is required",
            })}
          />
        </div>
        <p className="text-danger">
          {form.formState.errors?.laborCost &&
            form.formState.errors.laborCost.message}
        </p>
        <div className="flex gap-3 justify-between items-center">
          <label className="w-16" htmlFor="">
            Service Duration
          </label>
          <select
            name=""
            id=""
            {...form.register("estimatedDurationInMins")}
          >
            {Object.entries(serviceDuration).map(([key, value]) => (
              <option key={value} value={value}>
                {key}{" "}
              </option>
            ))}
          </select>
        </div>
      </section>
      <section className="border border-border-dark p-2 grid gap-1">
        <div className="flex justify-between items-center">
          <h3>Parts</h3>
          <button
            onClick={addPartHandler}
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
                  {...form.register(`parts.${index}.name`)}
                  placeholder="name"
                />
              </div>
              <div className="flex flex-col gap-2  items-center">
                <input
                  className={`border responsive-input border-border-dark p-1 rounded-lg outline-none  min-w-0 w-full `}
                  type="number"
                  {...form.register(`parts.${index}.cost`)}
                  placeholder="cost"
                />
              </div>
              <div className="flex flex-col gap-2  items-center">
                <input
                  className={`border responsive-input border-border-dark p-1 rounded-lg outline-none  min-w-0 w-full `}
                  type="number"
                  {...form.register(`parts.${index}.quantity`)}
                  placeholder="quantity"
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
                {form.formState.errors?.parts?.[index]?.name?.message}
              </p>
              <p className="text-danger">
                {form.formState.errors?.parts?.[index]?.cost?.message}
              </p>
              <p className="text-danger">
                {form.formState.errors?.parts?.[index]?.quantity?.message}
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
          className="bg-gray-200 p-4 rounded-xl transition-all duration-300 hover:bg-gray-300"
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

export default ServiceForm;
