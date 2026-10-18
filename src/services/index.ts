import axios from "axios";

export const SERVER_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3005/api/v1";

export const axiosJWT = axios.create();
axiosJWT.interceptors.request.use;