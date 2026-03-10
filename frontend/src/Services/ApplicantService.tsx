import axiosInstance from "../Interceptor/AxiosInterceptor";

/**
 * Lấy danh sách ứng viên (Lite) cho một Job
 */
const getApplicantsByJob = async (jobId: any) => {
    return axiosInstance.get(`/api/employer/applicants/job/${jobId}`)
        .then((result: any) => result.data)
        .catch((error: any) => { throw error; });
}

/**
 * Lấy chi tiết ứng viên (bao gồm CV Base64)
 */
const getApplicantDetail = async (id: any) => {
    return axiosInstance.get(`/api/employer/applicants/${id}/detail`)
        .then((result: any) => result.data)
        .catch((error: any) => { throw error; });
}

export { getApplicantsByJob, getApplicantDetail };
