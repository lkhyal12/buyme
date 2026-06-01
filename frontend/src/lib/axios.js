import axios from "axios";
import { useAuthStore } from "../store/authStore";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
axiosInstance.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization =
      "Bearer " + useAuthStore.getState().accessToken;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;
      try {
        const response = await axiosInstance.get("/auth/refresh", {
          withCredentials: true,
        });
        const newAccessToken = response.data.accessToken;

        useAuthStore.setState({ accessToken: newAccessToken });
        originalRequest.headers.Authorization =
          "Bearer " + response.data.accessToken;
        return axiosInstance(originalRequest);
      } catch (err) {
        useAuthStore.setState({ accessToken: null, user: null });
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  },
);
