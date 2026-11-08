import { privateApi } from "@/common/axios";

export async function getStats()
{
    const dateTimeNow = new Date()
      const year = dateTimeNow.getFullYear();
      const month = String(dateTimeNow.getMonth() + 1).padStart(2, "0");
      const day = String(dateTimeNow.getDate()).padStart(2, "0");
      const date = `${year}-${month}-${day}`;

    const response = await privateApi.get("api/v1/dashboard/stats",{params:{
       date:date
    }})
    return response.data;
}