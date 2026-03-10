package com.example.hirewave.dto;

import com.example.hirewave.Enum.ApplicationStatus;
import com.example.hirewave.entity.Applicant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Deprecated
public class ApplicantDTO {
	private Long id;
	private Long applicantId;
	private String name;
	private String email;
	private Long phone;
	private String website;
	private String resume; // Base64 - should not be used in list APIs
	private String extractedResume; // Base64 - should not be used in list APIs
	private String coverLetter;
	private LocalDateTime timestamp;
	private ApplicationStatus applicationStatus;
	private LocalDateTime interviewTime;
	private String extractedText; // Internal use only, should not be returned to client
	
	// New fields for AI matching
	private Long jobId;
	private Long profileId;
	private List<String> skills; // Normalized skills

	public Applicant toEntity() {
		Applicant applicant = new Applicant();
		applicant.setId(this.getId());
		applicant.setApplicantId(this.getApplicantId());
		applicant.setName(this.getName());
		applicant.setEmail(this.getEmail());
		applicant.setPhone(this.getPhone());
		applicant.setWebsite(this.getWebsite());
		applicant.setResume(this.getResume() != null ? Base64.getDecoder().decode(this.getResume()) : null);
		applicant.setExtractedResume(this.getExtractedResume() != null ? Base64.getDecoder().decode(this.getExtractedResume()) : null);
		applicant.setCoverLetter(this.getCoverLetter());
		applicant.setTimestamp(this.getTimestamp());
		applicant.setApplicationStatus(this.getApplicationStatus());
		applicant.setInterviewTime(this.getInterviewTime());
		applicant.setExtractedText(this.getExtractedText());
		applicant.setProfileId(this.getProfileId());
		applicant.setSkills(this.skills != null ? String.join(", ", this.skills) : null);
		return applicant;
	}
	
	/**
	 * Parse skills string to List
	 */
	private static List<String> parseSkills(String skillsString) {
		if (skillsString == null || skillsString.isBlank()) {
			return List.of();
		}
		return Arrays.stream(skillsString.split(","))
				.map(String::trim)
				.filter(s -> !s.isBlank())
				.collect(Collectors.toList());
	}
}
