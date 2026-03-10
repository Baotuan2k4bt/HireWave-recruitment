package com.example.hirewave.dto;

import com.example.hirewave.Enum.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for Applicant response (Lite version)
 * Does NOT include resume/extractedResume Base64 to reduce payload
 * Use separate endpoint to download resume if needed
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicantResponseDTO {
    private Long id;
    private Long applicantId;
    private Long jobId;
    private Long profileId;
    private String name;
    private String email;
    private Long phone;
    private String website;
    private String coverLetter;
    private LocalDateTime timestamp;
    private ApplicationStatus applicationStatus;
    private LocalDateTime interviewTime;
    
    // AI Matching fields
    private Double matchingScore;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    
    // Resume metadata (not the actual file)
    private Boolean hasResume;
    private Boolean hasExtractedResume;
}
