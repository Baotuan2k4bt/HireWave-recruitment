package com.example.hirewave.service.RecruiterAI;

import com.example.hirewave.dto.AIMatching.CandidateCompareDTO;
import com.example.hirewave.dto.AIMatching.EmployerCandidateRankingDTO;
import com.example.hirewave.exception.HireWaveException;

import java.util.List;
import java.util.Map;

public interface RecruiterAIService {
    List<EmployerCandidateRankingDTO> getRankingByJob(Long jobId)
            throws HireWaveException;

    List<EmployerCandidateRankingDTO> getTopCandidates(Long jobId, int limit)
            throws HireWaveException;

    CandidateCompareDTO compareCandidates(Long leftApplicationId, Long rightApplicationId)
            throws HireWaveException;

    CandidateCompareDTO compareCandidates(Long leftApplicationId, Long rightApplicationId, Map<String, Double> weights)
            throws HireWaveException;
}
