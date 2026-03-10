// src/Services/AdminService.ts
import axiosInstance from '../Interceptor/AxiosInterceptor';

export const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get('/admin/users');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export interface PagedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

export const getAllUsersPaged = async (page: number = 0, size: number = 20, sortBy: string = 'id'): Promise<PagedResponse<any>> => {
    try {
        const response = await axiosInstance.get(`/users/getAll/paged`, {
            params: { page, size, sortBy }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching users with pagination:', error);
        throw error;
    }
};

export const getAllJobs = async () => {
    try {
        const response = await axiosInstance.get('/admin/jobs');
        return response.data;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        throw error;
    }
};

export const getPendingJobs = async () => {
    try {
        const response = await axiosInstance.get('/admin/jobs/pending');
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error('Error fetching pending jobs:', error);
        return [];
    }
};

export const approveJob = async (id: number) => {
    try {
        const response = await axiosInstance.post(`/admin/jobs/${id}/approve`);
        return response.data;
    } catch (error) {
        console.error('Error approving job:', error);
        throw error;
    }
};

export const rejectJob = async (id: number) => {
    try {
        const response = await axiosInstance.post(`/admin/jobs/${id}/reject`);
        return response.data;
    } catch (error) {
        console.error('Error rejecting job:', error);
        throw error;
    }
};

export const changeAccountStatus = async (id: number, status: string) => {
    try {
        const response = await axiosInstance.post(`/admin/users/${id}/status/${status}`);
        return response.data;
    } catch (error) {
        console.error('Error changing account status:', error);
        throw error;
    }
};

export const getPendingEmployers = async () => {
    try {
        const response = await axiosInstance.get('/admin/employers/pending');
        return response.data;
    } catch (error) {
        console.error('Error fetching pending employers:', error);
        throw error;
    }
};

export const approveEmployer = async (id: number) => {
    try {
        const response = await axiosInstance.post(`/admin/employers/${id}/approve`);
        return response.data;
    } catch (error) {
        console.error('Error approving employer:', error);
        throw error;
    }
};

export const rejectEmployer = async (id: number) => {
    try {
        const response = await axiosInstance.post(`/admin/employers/${id}/reject`);
        return response.data;
    } catch (error) {
        console.error('Error rejecting employer:', error);
        throw error;
    }
};