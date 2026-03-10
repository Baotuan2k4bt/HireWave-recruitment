package com.example.hirewave.dto;

import com.example.hirewave.Enum.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for Applicant detail view
 * Includes resume/extractedResume Base64 for detail page only
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicantDetailDTO {
    private Long id;
    private Long applicantId;
    private Long jobId;
    private Long profileId;
    private String name;
    private String email;
    private Long phone;
    private String website;
    private String coverLetter;
    private String resume;
    private String extractedResume;
    private LocalDateTime timestamp;
    private ApplicationStatus applicationStatus;
    private LocalDateTime interviewTime;
    
    // AI Matching fields
    private Double matchingScore;
    private List<String> matchedSkills;
    private List<String> missingSkills;
}
