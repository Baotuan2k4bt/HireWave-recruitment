package com.example.hirewave.dto.AIMatching;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class EmployerCandidateRankingDTO {

    private Long applicationId;

    private Long applicantId;

    private String applicantName;

    private String email;

    private String role;

    private Double matchingScore;

    private List<String> matchedSkills;

    private List<String> missingSkills;

    private String summary;
}