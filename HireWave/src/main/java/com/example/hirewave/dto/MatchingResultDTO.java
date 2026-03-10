package com.example.hirewave.dto;

import com.example.hirewave.entity.MatchingResult;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * DTO for MatchingResult entity
 * Used to return AI matching analysis results
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchingResultDTO {
    private Long id;
    private Long applicationId;
    private Long applicantId;
    private Long jobId;
    private String jobTitle;
    private String company;
    private Double matchingScore;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private String summary;
    private LocalDateTime createdAt;

    /**
     * Convert MatchingResult entity to DTO
     */
    public static MatchingResultDTO fromEntity(MatchingResult matchingResult) {
        if (matchingResult == null) {
            return null;
        }
        MatchingResultDTO dto = new MatchingResultDTO();
        dto.setId(matchingResult.getId());
        dto.setApplicationId(matchingResult.getApplication() != null ? matchingResult.getApplication().getId() : null);
        dto.setApplicantId(matchingResult.getApplication() != null ? matchingResult.getApplication().getApplicantId() : null);
        dto.setJobId(matchingResult.getJob() != null ? matchingResult.getJob().getId() : null);
        dto.setJobTitle(matchingResult.getJob() != null ? matchingResult.getJob().getJobTitle() : null);
        dto.setCompany(matchingResult.getJob() != null && matchingResult.getJob().getCompany() != null 
            ? matchingResult.getJob().getCompany().getName() : null);
        dto.setMatchingScore(matchingResult.getMatchingScore());
        dto.setMatchedSkills(parseSkillsList(matchingResult.getMatchedSkills()));
        dto.setMissingSkills(parseSkillsList(matchingResult.getMissingSkills()));
        dto.setSummary(matchingResult.getSummary());
        dto.setCreatedAt(matchingResult.getCreatedAt());
        return dto;
    }

    /**
     * Parse comma-separated skills string to List
     */
    private static List<String> parseSkillsList(String skillsString) {
        if (skillsString == null || skillsString.isBlank()) {
            return List.of();
        }
        return Arrays.stream(skillsString.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .collect(Collectors.toList());
    }

    /**
     * Convert List of skills to comma-separated string for storage
     */
    public static String skillsListToString(List<String> skills) {
        if (skills == null || skills.isEmpty()) {
            return null;
        }
        return String.join(", ", skills);
    }
}
