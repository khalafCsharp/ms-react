import { privateApi } from "@/common/axios";
import { toUtcIso } from "@/common/utils";

export async function getAppointments(f) {
  const response = await privateApi.get("api/v1/workorders", {
    params: {
      page: f.page,
      pageSize: f.pageSize,
      searchTerm: f.searchTerm || undefined,
      sortColumn: f.sortColumn,
      sortDirection: f.sortDirection,
      state: f.state || undefined,
      startDate: toUtcIso(f.startDate),
      endDate: toUtcIso(f.endDate, true),
    },
  });
  return response.data;
}

export async function getAppointmentById(appointmentId) {
  const response = await privateApi.get(`api/v1/workorders/${appointmentId}`);
  return response.data;
}

export async function createAppointment(newAppointment) {
  const response = await privateApi.post("api/v1/workorders", newAppointment);
  return response.data;
}

export async function updateAppointmentState(newState, workOrderId) {
  const response = await privateApi.put(
    `api/v1/workorders/${workOrderId}/state`,
    { state: newState },
  );
  return response.data;
}

export async function assignNewLabor(laborId, workOrderId) {
  const response = await privateApi.put(
    `api/v1/workorders/${workOrderId}/labor`,
    { laborId: laborId },
  );
  return response.data;
}

export async function relocateAppointment(workOrderId, body) {
  const response = await privateApi.put(
    `api/v1/workorders/${workOrderId}/relocation`,
    body,
  );
  return response.data;
}

export async function deleteAppointment(appointmentId) {
  const response = await privateApi.delete(
    `api/v1/workorders/${appointmentId}`,
  );
  return response.data;
}

export async function updateAppointmentServices(appointmentId, repairTaskIds) {
  const response = await privateApi.put(
    `api/v1/workorders/${appointmentId}/repair-task`,
    { repairTaskIds },
  );
  return response.data;
}

// invoices api section
export async function getInvoiceById(invoiceId) {
  const response = await privateApi.get(`api/v1/invoices/${invoiceId}`);
  return response.data;
}

export async function createInvoice(workOrderId) {
  const response = await privateApi.post(
    `api/v1/invoices/workorders/${workOrderId}`
  );
  return response.data;
}

export async function settleInvoice(invoiceId) {
  const response = await privateApi.put(
    `api/v1/invoices/${invoiceId}/payments`
  );
  return response.data;
}

export async function downloadInvoiceAsPdf(invoiceId) {
  const response = await privateApi.get(
    `api/v1/invoices/${invoiceId}/pdf`
  );
  return response.data;
}

export async function getLabors() {
  const response = await privateApi.get(`api/v1/labors`);
  console.log(
    "labors from labors query, retrieved for filling the select element :  ",
    response.data,
  );
  return response.data;
}

export async function getSchedule(date, laborId) {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const response = await privateApi.get(`api/v1/workorders/schedule/${date}`, {
    params: { laborId: laborId || undefined },
    headers: {
      "X-TimeZone": tz,
    },
  });
  return response.data;
}
