import axios, { InternalAxiosRequestConfig } from "axios";
import { removeUser } from "../Slices/UserSlice";
import { removeJwt } from "../Slices/JwtSlice";

const axiosInstance = axios.create({
    baseURL: 'https://hirewave-recruitment.onrender.com'
    // baseURL: 'https://hiringwire-production.up.railway.app'
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export const setupResponseInterceptor = (navigate: any, dispatch: any) => {
    axiosInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response?.status === 401) {
                dispatch(removeUser());
                dispatch(removeJwt());
                navigate('/login');
            }
            // Normalize error structure to ensure response.data always exists
            if (!error.response) {
                error.response = {
                    data: {
                        errorMessage: error.message || 'Network error occurred. Please check your connection.'
                    },
                    status: 0
                };
            } else if (!error.response.data) {
                error.response.data = {
                    errorMessage: error.message || 'An error occurred'
                };
            } else if (!error.response.data.errorMessage) {
                error.response.data.errorMessage = error.response.data.message || error.message || 'An error occurred';
            }
            return Promise.reject(error);
        }
    )
}

export default axiosInstance;
