import {
  getAppointmentById,
  getAppointments,
  getInvoiceById,
  getLabors,
  getSchedule,
} from "./appointmentApi";

// const appointmentsQuery = {
//   queryKey: ["appointments", ],
//   queryFn: () => getAppointments(),
//   staleTime: Infinity,
//   retry: 0,
// };
export function appointmentsQuery(filters) {
  return {
    queryKey: ["appointments", filters],
    queryFn: () => getAppointments(filters),
    staleTime: Infinity,
    retry: 0,
  };
}
export default appointmentsQuery;

export const defaultFilters = {
  page: 1,
  pageSize: 10,
  searchTerm: "",
  sortColumn: "createdat",
  sortDirection: "desc",
  state: "",
  startDate: "",
  endDate: "",
};

export function appointmentDetailQuery(appointmentId) {
  return {
    queryKey: ["appointments", appointmentId],
    queryFn: () => getAppointmentById(appointmentId),
    staleTime: Infinity,
    retry: 0,
  };
}

export function invoiceDetailsQuery(invoiceId) {
  return {
    queryKey: [invoiceId],
    queryFn: () => getInvoiceById(invoiceId),
    staleTime: Infinity,
    retry: 0,
  };
}

export const scheduleQuery = (date, laborId) => ({
  queryKey: ["schedule", date, laborId],
  queryFn: () => getSchedule(date, laborId),
  staleTime: Infinity,
  retry: 2,
});


export const laborsQuery = {
  queryKey : ['labors'],
  queryFn: getLabors,
  staleTime: Infinity,
  retry: 2
}