import axios, { AxiosInstance } from "axios";

function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

let accessToken: string | null = null; 

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function useApi() {
  const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true, 
  });

  api.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers["Authorization"] = "Bearer " + accessToken;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        const refreshToken = getCookie("refreshToken"); 
        if (refreshToken) {
          try {
            const res = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
              {},
              { withCredentials: true }
            );
            setAccessToken(res.data.access_token);
            originalRequest.headers["Authorization"] =
              "Bearer " + res.data.access_token;
            return api(originalRequest);
          } catch (refreshError) {
            setAccessToken(null);
            window.location.reload();
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
}