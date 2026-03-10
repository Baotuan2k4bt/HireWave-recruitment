import axios from 'axios';
import { CareerFitRequest, CareerFitResponse } from '../types/ai-career.types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

export const AiCareerAnalysisService = {
  analyzeCareer: async (data: CareerFitRequest): Promise<CareerFitResponse> => {
    const response = await axios.post(`${API_BASE_URL}/ai/career-fit`, data);
    return response.data;
  },
};

