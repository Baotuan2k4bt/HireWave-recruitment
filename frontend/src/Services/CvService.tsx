import axiosInstance from "../Interceptor/AxiosInterceptor";

export interface UserResumeDTO {
    id: number;
    title: string;
    originalFilename: string;
    mimeType: string;
    size: number;
    createdAt: string;
    isDefault: boolean;
    fileUrl: string;
}

export const fetchMyCvs = async (): Promise<UserResumeDTO[]> => {
    const response = await axiosInstance.get<UserResumeDTO[]>("/cv/my");
    return response.data;
};

export const uploadCv = async (file: File, title?: string): Promise<UserResumeDTO> => {
    const formData = new FormData();
    formData.append("file", file);
    if (title) formData.append("title", title);

    const response = await axiosInstance.post<UserResumeDTO>("/cv/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const deleteCv = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/cv/delete/${id}`);
};

export const setDefaultCv = async (id: number): Promise<UserResumeDTO> => {
    const response = await axiosInstance.put<UserResumeDTO>(`/cv/${id}/default`);
    return response.data;
};

