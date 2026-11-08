import { redirect, useParams } from "react-router";
import { queryClient } from "@/common/queryClient";
import { appointmentDetailQuery } from "../queries";
import AppointmentDetailComponent from "../components/AppointmentDetailComponent";

function AppointmentDetail() {
  const { appointmentId } = useParams();


  return <AppointmentDetailComponent workOrderId={appointmentId} />;
}

// eslint-disable-next-line react-refresh/only-export-components
export function loader({ params }) {
  if (!localStorage.getItem("auth")) {
    throw redirect("/login");
  }

  const { appointmentId } = params;

  return queryClient.query(appointmentDetailQuery(appointmentId));
}
export default AppointmentDetail;
