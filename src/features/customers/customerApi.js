import { privateApi} from "../../common/axios";

export async function getCustomers() {
  const response = await privateApi.get("/api/v1/customers");

  return response.data;
}

export async function deleteCustomer(id) {
  const response = await privateApi.delete(`/api/v1/customers/${id}`);
  return response.data;
}

export async function editCustomer( id, editedCustomer ) {
  console.log("body of edit customer request:  ", editedCustomer)
  const response = await privateApi.put(`/api/v1/customers/${id}`, editedCustomer);
  return response.data;
}

export async function createCustomer(newCustomer) {
  const response = await privateApi.post(`/api/v1/customers`, newCustomer);
  return response.data;
}
