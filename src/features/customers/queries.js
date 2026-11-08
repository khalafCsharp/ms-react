import { getCustomers } from "./customerApi"

export const customerQuery = {
    queryKey : ["customers"],
    queryFn : getCustomers,
    staleTime : Infinity,
    retry : 0
}