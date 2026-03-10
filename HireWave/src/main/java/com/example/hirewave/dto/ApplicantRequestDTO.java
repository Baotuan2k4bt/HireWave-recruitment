package com.example.hirewave.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicantRequestDTO {
    private Long applicantId;
    private Long jobId;
    private String name;
    private String email;
    private Long phone;
    private String website;
    private String resume; // Base64 encoded PDF
    private String coverLetter;
    private List<String> skills; // Normalized skills extracted from resume/profile
    private Long profileId; // Link to Profile if exists
}
