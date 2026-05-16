import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !original._retry
    ) {
      original._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const res = await axios.post(`${BASE_URL}/auth/refresh`, null, {
            headers: { "Refresh-Token": refreshToken },
          });
          const newToken = res.data.data.accessToken;
          localStorage.setItem("accessToken", newToken);
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        } catch {
          localStorage.clear();
          window.location.href = "/login";
        }
      } else {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
export default api;
