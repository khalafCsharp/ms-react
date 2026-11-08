import { privateApi } from "@/common/axios";

export async function getRepairTasks() {
  const response = await privateApi.get("api/v1/repair-tasks");

  return response.data;
}

export async function getRepairTaskById(id) {
  const response = await privateApi.get(`api/v1/repair-tasks/${id}`);

  return response.data;
}

export async function deleteRepairTask(id) {
  const response = await privateApi.delete(`api/v1/repair-tasks/${id}`);
  return response.data;
}

export async function editRepairTask( id, editedTask ) {
  const response = await privateApi.put(`api/v1/repair-tasks/${id}`, editedTask);
  return response.data;
}

export async function createRepairTask(newTask) {
  const response = await privateApi.post(`api/v1/repair-tasks`, newTask);
  return response.data;
}
