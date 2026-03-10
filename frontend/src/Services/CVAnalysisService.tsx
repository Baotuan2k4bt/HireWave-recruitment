import axiosInstance from "../Interceptor/AxiosInterceptor";

export interface ParsingResult {
    score: number;
    issues: string[];
    suggestions: string[];
}

export interface CVAnalysisResponse {
    score: number;
    levelLabel?: string; // "Xuất sắc" | "Tốt" | "Trung bình" | "Yếu"
    verdict?: string; // "Đạt" | "Cần cải thiện" | "Không đạt"
    issues: string[];
    suggestions: string[];
    strengths?: string[]; // Điểm mạnh
    weaknesses?: string[]; // Điểm yếu
    breakdown?: { // Điểm theo từng tiêu chí
        contact: number;
        structure: number;
        length: number;
        header: number;
        impact: number;
    };
    uiHints?: { // Thông tin hỗ trợ UI
        atsReadability: number;
        contentImpact: number;
        wordCount: number;
        sectionCount: number;
        hasMetrics: boolean;
        hasActionVerbs: boolean;
    };
    parsedInfo?: {
        name?: string;
        email?: string;
        phone?: string;
        skills?: any;
        education?: any[];
        experience?: any[];
        certifications?: string[];
    };
    extractedText?: string;
    error?: string;
}

/**
 * Evaluate CV from extracted text
 */
export const evaluateCVText = async (extractedText: string): Promise<ParsingResult> => {
    try {
        const response = await axiosInstance.post("/api/candidate-ai/parsing/evaluate-text", extractedText, {
            headers: {
                'Content-Type': 'text/plain'
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || "Failed to evaluate CV text");
    }
};

/**
 * Evaluate CV from PDF file (base64)
 */
export const evaluateCVFromBase64 = async (base64Pdf: string): Promise<CVAnalysisResponse> => {
    try {
        const formData = new FormData();
        formData.append("base64", base64Pdf);
        
        const response = await axiosInstance.post("/api/candidate-ai/parsing/evaluate-pdf", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || "Failed to evaluate CV");
    }
};

/**
 * Evaluate CV from file upload
 */
export const evaluateCVFromFile = async (file: File): Promise<CVAnalysisResponse> => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        
        const response = await axiosInstance.post("/api/candidate-ai/parsing/evaluate-pdf", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || "Failed to evaluate CV");
    }
};
