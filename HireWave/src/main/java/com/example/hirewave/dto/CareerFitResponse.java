package com.example.hirewave.dto;

import java.util.List;

public record CareerFitResponse(
        String persona,
        String summary,
        Integer overallScore,                 // 0-100
        List<String> recommendedIndustries,   // top 3-5 ngành
        List<JobSuggestion> topJobs,          // 5 jobs
        List<String> strengths,
        List<String> improvements,
        List<String> roadmap30Days,
        List<String> jobKeywords
) {
    public record JobSuggestion(
            String title,
            String industry,
            Integer matchScore,   // 0-100
            String reason

    ) {
    }
}

