import axiosInstance from "../Interceptor/AxiosInterceptor";

export interface MatchingPreviewDTO {
    finalScore: number;
    skillRatio: number;
    expRatio: number;
    titleSimilarity: number;
    keywordDensity: number;
    summary: string;
    matchedSkills?: string[];
    missingSkills?: string[];
}

export const previewMatchingForJob = async (jobId: number): Promise<MatchingPreviewDTO> => {
    const res = await axiosInstance.get<MatchingPreviewDTO>(`/api/candidate-ai/matching/preview/${jobId}`);
    return res.data;
};

export interface EmployerCandidateRankingDTO {
    applicantId: number;
    applicationId: number;
    applicantName: string;
    email: string;
    role: string;
    matchingScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    summary: string;
}

export interface CandidateCompareDTO {
    leftCandidate: EmployerCandidateRankingDTO;
    rightCandidate: EmployerCandidateRankingDTO;
    betterCandidate: string;
    scoreGap: number;
    summary: string;
}

export const getRankingByJob = async (jobId: number): Promise<EmployerCandidateRankingDTO[]> => {
    const res = await axiosInstance.get<EmployerCandidateRankingDTO[]>(`/api/employer-ai/job/${jobId}/ranking`);
    return res.data;
};

export const getTopCandidates = async (jobId: number, limit: number = 3): Promise<EmployerCandidateRankingDTO[]> => {
    const res = await axiosInstance.get<EmployerCandidateRankingDTO[]>(`/api/employer-ai/job/${jobId}/top`, {
        params: { limit }
    });
    return res.data;
};

export const compareCandidates = async (leftApplicationId: number, rightApplicationId: number): Promise<CandidateCompareDTO> => {
    const res = await axiosInstance.get<CandidateCompareDTO>(`/api/employer-ai/compare`, {
        params: { leftApplicationId, rightApplicationId }
    });
    return res.data;
};

