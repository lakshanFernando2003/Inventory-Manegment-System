import axios from "axios";

// base axios instance for general API endpoints
export const axiosIntance = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
});

// separate axios instance specifically for auth endpoints
export const authAxiosInstance = axios.create({
    baseURL: "http://localhost:5000/api/auth",
    withCredentials: true,
});
