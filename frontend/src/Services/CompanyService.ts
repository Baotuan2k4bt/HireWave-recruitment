import axiosInstance from "../Interceptor/AxiosInterceptor";

export interface CompanyDTO {
    id?: number;
    name: string;
    logoUrl?: string;
    website?: string;
    location?: string;
    industry?: string;
    companySize?: string;
    description?: string;
    ownerId?: number;
}

export const getCompany = async (id: number): Promise<CompanyDTO> => {
    return axiosInstance
        .get(`/api/companies/${id}`)
        .then((result: any) => result.data)
        .catch((error: any) => {
            throw error;
        });
};

export const createCompany = async (companyData: CompanyDTO): Promise<CompanyDTO> => {
    return axiosInstance.post('/api/employer/company', companyData)
        .then(res => res.data)
        .catch(err => { throw err; });
};

export const updateCompany = async (id: number, companyData: CompanyDTO): Promise<CompanyDTO> => {
    return axiosInstance.put(`/api/employer/company/${id}`, companyData)
        .then(res => res.data)
        .catch(err => { throw err; });
};

export const getMyCompany = async (): Promise<CompanyDTO> => {
    return axiosInstance.get('/api/employer/company')
        .then(res => res.data)
        .catch(err => { throw err; });
};

