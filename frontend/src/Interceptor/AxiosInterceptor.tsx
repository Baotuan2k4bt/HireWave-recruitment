import axios, { InternalAxiosRequestConfig } from "axios";
import { removeUser } from "../Slices/UserSlice";
import { removeJwt } from "../Slices/JwtSlice";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080",
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

let responseInterceptorAdded = false;

export const setupResponseInterceptor = (navigate: any, dispatch: any) => {
    if (responseInterceptorAdded) return;
    responseInterceptorAdded = true;

    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                dispatch(removeUser());
                dispatch(removeJwt());
                navigate("/login");
            }

            if (!error.response) {
                error.response = {
                    data: {
                        errorMessage:
                            error.message ||
                            "Network error occurred. Please check your connection.",
                    },
                    status: 0,
                };
            } else if (typeof error.response.data === 'string') {
                error.response.data = {
                    errorMessage: error.response.data,
                };
            } else if (!error.response.data.errorMessage) {
                error.response.data.errorMessage =
                    error.response.data.message ||
                    error.message ||
                    "An error occurred";
            }

            return Promise.reject(error);
        }
    );
};

export default axiosInstance;