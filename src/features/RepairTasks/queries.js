import { getRepairTasks } from "./repairTaskApi";

export const servicesQuery = {
    queryKey : ["services"],
    queryFn : getRepairTasks,
    staleTime : Infinity,
    retry : 0
}

