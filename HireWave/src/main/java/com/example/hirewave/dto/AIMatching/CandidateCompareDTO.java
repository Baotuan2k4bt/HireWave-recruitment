package com.example.hirewave.dto.AIMatching;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CandidateCompareDTO {

    private EmployerCandidateRankingDTO leftCandidate;

    private EmployerCandidateRankingDTO rightCandidate;

    private String betterCandidate;

    private double scoreGap;

    private String summary;
}