import { redirect } from "react-router";
import AppointmentListHeaderSection from "../components/AppointmentListHeaderSection";
import { queryClient } from "@/common/queryClient";
import appointmentsQuery, { defaultFilters } from "../queries";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AppointmentsTable from "../components/AppointmentsTable";
import AppointmentRow from "../components/AppointmentRow";
import Pagination from "@/common/components/Pagination";

function AppointmentList() {
  const [filters, setFilters] = useState(defaultFilters);
   const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  const query = useQuery(appointmentsQuery(appliedFilters));

  if (query.isLoading) {
    return <p>...Loading</p>;
  }
  if (query.error) {
    return <p>...error</p>;
  }


  const appointments = query.data.items.map((a) => (
    <AppointmentRow key={a.workOrderId} appointment={a} />
  ));

  
  return (
    <div className={`grid gap-1 `}>
      <AppointmentListHeaderSection
        setAppliedFilters={setAppliedFilters}
        filters={filters}
        setFilters={setFilters}
      />
      <div className="w-full rounded-lg border border-border px-2  shadow-sm bg-background-light min-w-90 overflow-x-auto">
        <AppointmentsTable setFilters={setFilters}>
          {appointments}
        </AppointmentsTable>
        <Pagination pageNumber={query.data.pageNumber} rowsNumber={query.data.totalItems} totalPages={query.data.totalPages} setAppliedFilters={setAppliedFilters} />
      </div>
    </div>
  );
}


// eslint-disable-next-line react-refresh/only-export-components
export function loader() {
  if (!localStorage.getItem("auth")) {
    throw redirect("/login");
  }
  return queryClient.query(appointmentsQuery(defaultFilters));
}
export default AppointmentList;
