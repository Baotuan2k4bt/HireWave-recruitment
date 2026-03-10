package com.example.hirewave.entity;


import com.example.hirewave.dto.ApplicantDTO;
import com.example.hirewave.Enum.ApplicationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Base64;

@Entity
@Table(
		uniqueConstraints = @UniqueConstraint(name = "uk_applicant_job", columnNames = {"applicant_id", "job_id"}),
		indexes = {
				@Index(name = "idx_applicant_user", columnList = "applicant_id"),
				@Index(name = "idx_applicant_job", columnList = "job_id")
		}
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Applicant {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "applicant_id", nullable = false)
	private Long applicantId;  // This is the user ID
	private String name;
	private String email;
	private Long phone;
	private String website;
	@Lob
	@Column(name = "resume", columnDefinition = "LONGBLOB")
	private byte[] resume;
	@Lob
	@Column(name = "extracted_resume", columnDefinition = "LONGBLOB")
	private byte[] extractedResume;
	private String coverLetter;
	private LocalDateTime timestamp;

	@Enumerated(EnumType.STRING)
	@Column(name = "application_status", length = 30)
	private ApplicationStatus applicationStatus;
	private LocalDateTime interviewTime;


	@ManyToOne
	@JoinColumn(name = "job_id")
	private Job job;

	@Column(name = "extracted_text", columnDefinition = "TEXT")
	private String extractedText;
	
	// Fields for AI matching optimization
	@Column(name = "profile_id", nullable = true)
	private Long profileId; // Link to Profile if exists - nullable for backward compatibility
	
	// Normalized skills extracted from resume/profile (comma-separated)
	@Column(name = "skills", columnDefinition = "TEXT", nullable = true)
	private String skills; // Normalized skills for quick matching - nullable for backward compatibility


	public ApplicantDTO toDTO() {
		ApplicantDTO dto = new ApplicantDTO();
		dto.setId(this.id);
		dto.setApplicantId(this.applicantId);
		dto.setName(this.name);
		dto.setEmail(this.email);
		dto.setPhone(this.phone);
		dto.setWebsite(this.website);

		dto.setResume(this.resume != null ? Base64.getEncoder().encodeToString(this.resume) : null);
		dto.setExtractedResume(this.extractedResume != null ? Base64.getEncoder().encodeToString(this.extractedResume) : null);

		dto.setCoverLetter(this.coverLetter);
		dto.setTimestamp(this.timestamp);
		dto.setApplicationStatus(this.applicationStatus);
		dto.setInterviewTime(this.interviewTime);
		dto.setExtractedText(this.extractedText);
		
		// New fields for AI matching
		dto.setJobId(this.job != null ? this.job.getId() : null);
		dto.setProfileId(this.profileId);
		dto.setSkills(parseSkills(this.skills));

		return dto;
	}
	
	/**
	 * Parse skills string to List
	 */
	private static java.util.List<String> parseSkills(String skillsString) {
		if (skillsString == null || skillsString.isBlank()) {
			return java.util.List.of();
		}
		return java.util.Arrays.stream(skillsString.split(","))
				.map(String::trim)
				.filter(s -> !s.isBlank())
				.collect(java.util.stream.Collectors.toList());
	}
}