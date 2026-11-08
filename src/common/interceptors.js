import { privateApi } from "./axios";
import { refreshRequest } from "../features/identity/identityApi";

export function getAuthItem() {
  const authItem = localStorage.getItem("auth");

  if (!authItem) {
    return null;
  }
  return JSON.parse(authItem);
}

function getAccessToken() {
  const authItem = getAuthItem();

  return authItem?.accessToken;
}

// Intercept requests and add Authorization header for reqquests that need authorization

privateApi.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

//Intercept responses with 401 Unauthorized and refresh the tokens and try again for only one time

privateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest.retry) {
      originalRequest.retry = true;

      const authItem = getAuthItem();

      if (!authItem?.refreshToken) {
        return Promise.reject(error);
      }

      const refreshRequestBody = {
        expiredAccessToken: authItem?.accessToken,
        refreshToken: authItem.refreshToken,
      };

      const newTokens = await refreshRequest(refreshRequestBody);

      localStorage.setItem("auth", JSON.stringify(newTokens));

      originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;

      return privateApi(originalRequest);
    }
    return Promise.reject(error);
  },
);
