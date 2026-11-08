import { createBrowserRouter } from "react-router";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Customers from "../features/customers/pages/Customers";
import { loader as customerLoader } from "../features/customers/pages/Customers";
import Login from "@/features/identity/pages/Login";
import ProtectedRoute from "@/features/identity/components/ProtectedRoute";
import Forbidden from "./pages/Forbidden";
import Services, {loader as servicesLoader} from "@/features/RepairTasks/pages/Services";
import Dashboard, {loader as dashboardLoader} from "@/features/dashboard/pages/Dashboard";
import AppointmentList, {
  loader as appointmentListLoader,
} from "@/features/Appointments/pages/AppointmentList";
import Schedule from "@/features/Appointments/pages/Schedule";
import AppointmentDetail, {
  loader as appointmentDetailLoader,
} from "@/features/Appointments/pages/AppointmentDetail";
import InvoiceDetails, {
  loader as invoiceDetailsLoader,
} from "@/features/Appointments/pages/InvoiceDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forbidden",
        element: <Forbidden />,
      },
      {
        element: <ProtectedRoute allowedRoles={["Manager", "Labor"]} />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
            loader: dashboardLoader,
          },
          {
            path: "customers",
            element: <Customers />,
            loader: customerLoader,
          },
          {
            path: "services",
            element: <Services />,
            loader: servicesLoader,
          },
          {
            path: "schedule",
            element: <Schedule />,
          
          },
          {
            path: "appointmentlist",
            element: <AppointmentList />,
            loader: appointmentListLoader,
          },
          {
            path: "appointmentlist/:appointmentId",
            element: <AppointmentDetail />,
            loader: appointmentDetailLoader,
          },
          {
            path: "invoicedetails/:invoiceId",
            element: <InvoiceDetails />,
            loader: invoiceDetailsLoader,
          },
        ]
      },
    ],
  },
]);
