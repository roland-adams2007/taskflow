import axios from "axios";
import { Cookies } from "react-cookie";

const { VITE_BACKEND_URL } = import.meta.env;
const cookies = new Cookies();

const axiosInstance = axios.create({
  baseURL: VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = cookies.get("session_meta");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
