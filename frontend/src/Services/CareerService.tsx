import axiosInstance from "../Interceptor/AxiosInterceptor";

export interface DevToArticle {
    id: number;
    title: string;
    description: string;
    readable_publish_date: string;
    tag_list: string[];
    cover_image: string | null;
    social_image: string;
    url: string;
    canonical_url?: string;
    reading_time_minutes?: number;
    positive_reactions_count?: number;
    comments_count?: number;
    [key: string]: any;
}

// --------- VN EXPRESS JOB NEWS (theo logic BE VnJobNewsController) ---------

export interface VnJobNews {
    title: string;
    description: string;
    link: string;
    pubDate: string;
    source: string;
}

export interface PagedResponse<T> {
    page: number;
    size: number;
    hasMore: boolean;
    items: T[];
}

// Dev.to APIs từ CareerAPI trả về JSON dạng string, cần parse trước khi dùng
const parseDevToResponse = <T,>(res: any): T => {
    if (typeof res.data === "string") {
        try {
            return JSON.parse(res.data) as T;
        } catch {
            throw new Error("Cannot parse Dev.to response");
        }
    }
    return res.data as T;
};

const getInterviewArticles = async (page: number = 1, size: number = 12): Promise<DevToArticle[]> => {
    return axiosInstance
        .get(`/career/interview`, { params: { page, size } })
        .then((res: any) => parseDevToResponse<DevToArticle[]>(res))
        .catch((error: any) => {
            throw error;
        });
};

const getInterviewArticleDetail = async (id: number): Promise<DevToArticle> => {
    return axiosInstance
        .get(`/career/interview/${id}`)
        .then((res: any) => parseDevToResponse<DevToArticle>(res))
        .catch((error: any) => {
            throw error;
        });
};

// Dev.to job news (CareerAPI /news)
const getJobNews = async (page: number = 1, size: number = 12): Promise<DevToArticle[]> => {
    return axiosInstance
        .get(`/career/news`, { params: { page, size } })
        .then((res: any) => parseDevToResponse<DevToArticle[]>(res))
        .catch((error: any) => {
            throw error;
        });
};

// Dev.to job tips (CareerAPI /tips)
const getJobTips = async (page: number = 1, size: number = 12): Promise<DevToArticle[]> => {
    return axiosInstance
        .get(`/career/tips`, { params: { page, size } })
        .then((res: any) => parseDevToResponse<DevToArticle[]>(res))
        .catch((error: any) => {
            throw error;
        });
};

// VN job news từ VnExpress (VnJobNewsController /career/vn-news)
const getVnJobNews = async (
    page: number = 1,
    size: number = 12
): Promise<PagedResponse<VnJobNews>> => {
    return axiosInstance
        .get(`/career/vn-news`, { params: { page, size } })
        .then((res: any) => res.data)
        .catch((error: any) => {
            throw error;
        });
};

export { getInterviewArticles, getInterviewArticleDetail, getJobNews, getJobTips, getVnJobNews };
