import { privateApi, publicApi } from "../../common/axios";

export async function refreshRequest(refreshRequestBody) {
    
    const response = await publicApi.post('/identity/token/refresh-token',refreshRequestBody)
    return response.data
}

export async function loginRequest(email, password) {
    
    const response = await publicApi.post(
      "/identity/token/generate",
      {email, password},
    );
    return response.data
}

export async function getCurrentUserInfoRequest() {
    
    const response = await privateApi.get(
      "/identity/current-user/claims",
     
    );
    return response.data
}

