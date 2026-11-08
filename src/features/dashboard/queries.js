import { getStats } from "./dashboardApi";

export  const dashboardQuery = {
  queryKey: ["dashboard"],
  queryFn: ()=>getStats(),
  staleTime: Infinity,
  retry: 0,
};