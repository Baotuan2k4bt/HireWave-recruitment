import axiosInstance from "../Interceptor/AxiosInterceptor";

const getProfile = async (id:any)=>{
    return axiosInstance.get(`/profiles/get/${id}`)
        .then((result:any) => result.data)
        .catch((error:any) =>{throw error;});
}
const updateProfile = async (profile:any)=>{
    return axiosInstance.put(`/profiles/update`, profile)
        .then((result:any) => result.data)
        .catch((error:any) =>{throw error;});
}
const getAllProfiles = async ()=>{
    return axiosInstance.get(`/profiles/getAll`)
        .then((result:any) => result.data)
        .catch((error:any) =>{throw error;});
}

export interface PagedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

export const getAllProfilesPaged = async (page: number = 0, size: number = 20, sortBy: string = 'id'): Promise<PagedResponse<any>> => {
    return axiosInstance.get(`/profiles/getAll/paged`, {
        params: { page, size, sortBy }
    })
    .then((result:any) => result.data)
    .catch((error:any) =>{throw error;});
}

export {getProfile, updateProfile, getAllProfiles};