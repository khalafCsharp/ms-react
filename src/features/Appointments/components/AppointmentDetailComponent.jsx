import { useQuery } from "@tanstack/react-query";
import { appointmentDetailQuery } from "../queries";
import { CarFront, Toolbox } from "lucide-react";
import DataBox from "./DataBox";
import AppointmentState from "./AppointmentState";
import { convertSpotToLetter, showDateTime } from "@/common/utils";

function AppointmentDetailComponent({ workOrderId }) {
  const query = useQuery(appointmentDetailQuery(workOrderId));

  if (query.isLoading) {
    return <p>loading</p>;
  } else if (query.isError) {
    return <p>error</p>;
  }

  return (
    <div className="grid gap-1 px-2 ">
      <div className="flex gap-1 items-center bg-background">
        <div className="w-2 h-18 bg-border rounded-lg"></div>
        <div className="flex items-center justify-start gap-2">
          <Toolbox />
          <h1 className="text-2xl  uppercase font-semibold text-text mb-1">
            Appointment Details
          </h1>
        </div>
      </div>
      <section className="overflow-y-auto grid grid-cols-1  lg:grid-cols-2  gap-4 border border-border bg-background p-2">
        <div className="bg-background-light rounded-2xl">
          <h3 className="text-center py-2 text-2xl bg-info rounded-tr-2xl rounded-tl-2xl">
            Vehicle Information
          </h3>
          <CarFront className="w-48 h-32 mx-auto" />
          <div className="px-4 flex flex-wrap justify-between items-center text-2xl ">
            <div className="text-center">
              <p className="text-lg text-text-muted">Make</p>
              <p>{query.data.vehicle.make}</p>
            </div>
            <div className="text-center">
              <p className="text-lg text-text-muted">Model</p>
              <p>{query.data.vehicle.model}</p>
            </div>
            <div className="text-center">
              <p className="text-lg text-text-muted">Year</p>
              <p>{query.data.vehicle.year}</p>
            </div>
            <div className="text-center">
              <p className="text-lg text-text-muted">Plate</p>
              <p>{query.data.vehicle.licensePlate}</p>
            </div>
          </div>
        </div>
        <div className="bg-background-light rounded-2xl">
          <h3 className="text-center py-2 text-2xl bg-info rounded-tr-2xl rounded-tl-2xl">
            Appointment Information
          </h3>
          <div className="mb-2 p-2  flex justify-center flex-wrap  gap-2 items-center text-xl ">
            <DataBox>
              <p className="text-lg text-text-muted">Appointment id:</p>
              <p className="text-xl text-center">{query.data.workOrderId}</p>
            </DataBox>
            <DataBox>
              <p className="text-lg text-text-muted">State:</p>
              <AppointmentState state={query.data.state} />
            </DataBox>
            <DataBox>
              <p className="text-lg text-text-muted">Spot:</p>
              <p className="text-2xl text-center">
                {convertSpotToLetter(query.data.spot)}
              </p>
            </DataBox>
            <DataBox>
              <p className="text-lg text-text-muted">Duration:</p>
              <p className="text-2xl text-center">
                {query.data.totalDurationInMins} minutes
              </p>
            </DataBox>
            <DataBox>
              <p className="text-lg text-text-muted">Labor:</p>
              <p className="text-2xl text-center">{query.data.labor.name}</p>
            </DataBox>
            <DataBox>
              <p className="text-lg text-text-muted">Scheduled at:</p>
              <p className="text-2xl text-center">
                {showDateTime(query.data.createdAt)}
              </p>
            </DataBox>
          </div>
        </div>
        <div className="bg-background-light lg:col-span-2 rounded-2xl">
          <h3 className="text-center py-2 text-2xl bg-info rounded-tr-2xl rounded-tl-2xl">
            Services Information
          </h3>
          <div className="p-4">
            <div className="grid gap-4">
              {query.data.repairTasks.map((s) => (
                <div
                  className="grid gap-1 p-2 border-border border shadow-lg"
                  key={s.repairTaskId}
                >
                  <div className=" border border-border py-2">
                    <p className="text-2xl ">
                      {s.name}
                      <span className="bg-info ml-2 p-1 text-lg rounded-lg whitespace-nowrap">
                        labor: ${s.laborCost}
                      </span>
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full shadow-2xl">
                      <thead className="py-8">
                        <tr className="bg-background py-2">
                          <th>part</th>
                          <th>price</th>
                          <th>quantity</th>
                          <th>subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {s.repairTaskParts.map((p) => (
                          <tr
                            key={p.partId}
                            className="bg-background-light p-2 text-center"
                          >
                            <td>{p.name}</td>
                            <td>${p.cost}</td>
                            <td>{p.quantity}X</td>
                            <td>${p.quantity * p.cost}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
              <div className="border-2 border-border p-2 text-xl ">
                <div className="grid grid-cols-2 p-2 border-b border-b-border">
                  <p>total labor cost</p>
                  <p className="justify-self-end">
                    {query.data.totalLaborCost}$
                  </p>
                </div>
                <div className="grid grid-cols-2 p-2 border-b border-b-border">
                  <p>total parts cost</p>
                  <p className="justify-self-end">
                    {query.data.totalPartCost}$
                  </p>
                </div>
                <div className="grid grid-cols-2 p-2 border-b border-b-border">
                  <p>Total</p>
                  <p className="justify-self-end">{query.data.totalCost}$</p>
                </div>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AppointmentDetailComponent