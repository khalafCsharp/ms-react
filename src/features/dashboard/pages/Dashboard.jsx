import { queryClient } from "@/common/queryClient";
import { redirect } from "react-router";
import * as signalR from "@microsoft/signalr";

import { dashboardQuery } from "../queries";
import { useQuery } from "@tanstack/react-query";
import {
  Ban,
  CarFront,
  ChartLine,
  ChartPie,
  Check,
  ClipboardCheck,
  DollarSign,
  Engine,
  Gauge,
  HourglassCog,
  List,
  Settings,
  User,
  UserRoundCog,

  X,
} from "lucide-react";
import { useEffect } from "react";
import { getAuthItem } from "@/common/interceptors";

function Dashboard() {
  const query = useQuery(dashboardQuery);
  const data = query.data;
useEffect(() => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5001/hubs/workorders", {
      accessTokenFactory: () => getAuthItem()?.accessToken ?? "",
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Warning)
    .build();

  connection.on("WorkOrdersChanged", () => {
    queryClient.refetchQueries({
      queryKey: dashboardQuery.queryKey,
    });

    console.log("invalidating dashboard query to trigger refetching");
  });

  connection.on("InvoiceIssued", () => {
    queryClient.refetchQueries({
      queryKey: dashboardQuery.queryKey,
    });

    console.log("invalidating dashboard query to trigger refetching");
  });

  connection
    .start()
    .then(() => console.log("🟢 SIGNALR CONNECTED"))
    .catch((err) => console.error("SignalR connection failed:", err));

  return () => {
    connection.off("WorkOrdersChanged");
    connection.stop();
  };
}, []);
  if (query.isLoading) {
    return <p>loading...</p>;
  }

  if (query.isError) {
    console.log("error of dashboard page: ", query.error);
    return <p>{query.error.toString()}</p>;
  }

  // Fallback if data is not populated yet
  if (!data) return null;

  return (
    <div className="grid  container mx-auto gap-2">
      <div>
        <p className="text-text text-center text-xl">
          Statistics for {new Date(data.statsDate).toLocaleDateString("en-CA")}
        </p>
      </div>
      <div className="grid grid-cols-5 gap-2">
        <div className="card ">
          <div className="flex justify-start items-center gap-2 mb-4">
            <List />
            <p className="whitespace-nowrap">Total Orders</p>
          </div>
          <div>
            <p className="font-bold text-2xl text-text">
              {data.totalWorkOrders}
            </p>
          </div>
        </div>
        <div className="card  bg-warning">
          <div className="flex justify-start items-center gap-2 mb-4">
            <HourglassCog className="text-warning" />
            <p className="whitespace-nowrap text-text">Scheduled</p>
          </div>
          <div>
            <p className="font-bold text-2xl text-text">
              {data.scheduledWorkOrders}
            </p>
          </div>
        </div>
        <div className="card bg-info">
          <div className="flex justify-start items-center gap-2 mb-4">
            <Settings className="text-info" />
            <p className="whitespace-nowrap text-text">In Progress</p>
          </div>
          <div>
            <p className="font-bold text-2xl text-text">
              {data.inProgressWorkOrders}
            </p>
          </div>
        </div>
        <div className="card bg-success">
          <div className="flex justify-start items-center gap-2 mb-4">
            <Check className="text-success" />
            <p className="whitespace-nowrap text-text">Completed</p>
          </div>
          <div>
            <p className="font-bold text-2xl text-text">
              {data.completedWorkOrders}
            </p>
          </div>
        </div>
        <div className="card bg-danger">
          <div className="flex justify-start items-center gap-2 mb-4">
            <X className="text-danger" />
            <p className="whitespace-nowrap text-text">Cancelled</p>
          </div>
          <div>
            <p className="font-bold text-2xl text-text">
              {data.cancelledWorkOrders}
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-1">
        <div className="card ">
          <div className="flex justify-start items-center gap-2 mb-4">
            <DollarSign className="text-info" />
            <p className="whitespace-nowrap">Total Revenue</p>
          </div>
          <div>
            <p className="font-bold text-2xl text-text">
              ${data.totalRevenue?.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="card ">
          <div className="flex justify-start items-center gap-2 mb-4">
            <Engine className="text-warning" />
            <p className="whitespace-nowrap">Parts Cost</p>
          </div>
          <div>
            <p className="font-bold text-2xl text-text">
              ${data.totalPartsCost?.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="card ">
          <div className="flex justify-start items-center gap-2 mb-4">
            <UserRoundCog className="text-warning" />
            <p className="whitespace-nowrap">Labor Cost</p>
          </div>
          <div>
            <p className="font-bold text-2xl text-text">
              ${data.totalLaborCost?.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="card ">
          <div className="flex justify-start items-center gap-2 mb-4">
            <DollarSign className="text-success" />
            <p className="whitespace-nowrap">Net Profit</p>
          </div>
          <div>
            <p className="font-bold text-2xl text-text">
              ${data.netProfit?.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      <section className="grid grid-cols-3 gap-2 ">
        <div className="card">
          <div className="flex justify-start items-center gap-2 mb-4">
            <CarFront className="text-success" />
            <p className="whitespace-nowrap">Unique Vehicles</p>
          </div>
          <div>
            <p className="font-bold text-2xl text-text">
              {data.uniqueVehicles}
            </p>
          </div>
        </div>
        <div className="card">
          <div className="flex justify-start items-center gap-2 mb-4">
            <User className="text-success" />
            <p className="whitespace-nowrap">Unique Customers</p>
          </div>
          <div>
            <p className="font-bold text-2xl text-text">
              {data.uniqueCustomers}
            </p>
          </div>
        </div>
        <div className="card">
          <div className="flex justify-start items-center gap-2 mb-4">
            <DollarSign className="text-success" />
            <p className="whitespace-nowrap">Profit Margin</p>
          </div>
          <div>
            <p className="font-bold text-2xl text-text">${data.profitMargin.toFixed(2)}</p>
          </div>
        </div>
        <div className="card">
          <div className="flex justify-start items-center gap-2 mb-4">
            <ClipboardCheck className="text-success" />
            <p className="whitespace-nowrap">Completion Rate</p>
          </div>
          <div>
            <p className="font-bold text-2xl text-text">
              {data.completionRate.toFixed(2)}%
            </p>
          </div>
        </div>
        <div className="card">
          <div className="flex justify-start items-center gap-2 mb-4">
            <ChartLine className="text-success" />
            <p className="whitespace-nowrap">Avg. Revenue/Order</p>
          </div>
          <div>
            <p className="font-bold text-2xl text-text">
              {data.averageRevenuePerOrder.toFixed(2)}%
            </p>
          </div>
        </div>
        <div className="card">
          <div className="flex justify-start items-center gap-2 mb-4">
            <Gauge className="text-success" />
            <p className="whitespace-nowrap">Order Per Vehicle</p>
          </div>
          <div>
            <p className="font-bold text-2xl text-text">
              {data.ordersPerVehicle.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="card">
          <div className="flex justify-start items-center gap-2 mb-4">
            <ChartPie className="text-success" />
            <p className="whitespace-nowrap">Parts Cost Ratio</p>
          </div>
          <div>
            <p className="font-bold text-2xl text-text">
              {data.partsCostRatio.toFixed(2)}%
            </p>
          </div>
        </div>
        <div className="card">
          <div className="flex justify-start items-center gap-2 mb-4">
            <ChartPie className="text-success" />
            <p className="whitespace-nowrap">Labor Cost Ratio</p>
          </div>
          <div>
            <p className="font-bold text-2xl text-text">
              {data.laborCostRatio.toFixed(2)}%
            </p>
          </div>
        </div>
        <div className="card">
          <div className="flex justify-start items-center gap-2 mb-4">
            <Ban className="text-success" />
            <p className="whitespace-nowrap">Cancellation Rate</p>
          </div>
          <div>
            <p className="font-bold text-2xl text-text">
              {data.cancellationRate.toFixed(2)}%
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}


// eslint-disable-next-line react-refresh/only-export-components
export function loader() {
  if (!localStorage.getItem("auth")) {
    throw redirect("/login");
  }
  return queryClient.query(dashboardQuery);
}

export default Dashboard;
