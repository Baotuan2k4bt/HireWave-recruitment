package com.example.hirewave.api;

import com.example.hirewave.dto.AIMatching.CandidateCompareDTO;
import com.example.hirewave.dto.AIMatching.EmployerCandidateRankingDTO;
import com.example.hirewave.exception.HireWaveException;
import com.example.hirewave.service.RecruiterAI.RecruiterAIService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employer-ai")
public class EmployerAPI {
    private final RecruiterAIService recruiterAIService;

    public EmployerAPI(RecruiterAIService recruiterAIService) {
        this.recruiterAIService = recruiterAIService;
    }

    @GetMapping("/job/{jobId}/ranking")
    public List<EmployerCandidateRankingDTO> ranking(@PathVariable Long jobId)
            throws HireWaveException {

        return recruiterAIService.getRankingByJob(jobId);
    }

    @GetMapping("/job/{jobId}/top")
    public List<EmployerCandidateRankingDTO> top(
            @PathVariable Long jobId,
            @RequestParam(defaultValue = "3") int limit
    ) throws HireWaveException {

        return recruiterAIService.getTopCandidates(jobId, limit);
    }

    @GetMapping("/compare")
    public CandidateCompareDTO compare(
            @RequestParam Long leftApplicationId,
            @RequestParam Long rightApplicationId
    ) throws HireWaveException {

        return recruiterAIService.compareCandidates(
                leftApplicationId,
                rightApplicationId
        );
    }
}
