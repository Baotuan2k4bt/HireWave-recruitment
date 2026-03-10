package com.example.hirewave.dto;

import com.example.hirewave.entity.Profile;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Base64;
import java.util.List;

/**
 * DTO for Profile entity
 * Enhanced with optional fields for AI matching
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDTO {
	private Long id;
	private String name;
	private String email;
	private String jobTitle;
	private String company;
	private String location;
	private String about;
	private String picture;
	
	// Experience in years (clarified unit)
	private Integer totalExpYears; // Renamed from totalExp for clarity
	
	// Legacy field - kept for backward compatibility
	private Long totalExp;
	
	// Normalized skills (lowercase, trimmed, deduplicated)
	private List<String> skills;
	private List<Experience> experiences;
	private List<Certification> certifications;
	private List<Long> savedJobs;
	
	// Optional fields for enhanced AI matching
	private List<String> languages; // e.g., ["English", "Vietnamese"]
	private List<String> preferredLocations; // Preferred work locations
	private Boolean remotePreference; // Prefer remote work
	private List<String> desiredJobTypes; // e.g., ["Full-time", "Part-time", "Contract"]
	
	public Profile toEntity() {
		// Convert totalExpYears to totalExp if needed
		Long totalExpValue = totalExp != null ? totalExp : 
			(totalExpYears != null ? totalExpYears.longValue() : null);
			
		return new Profile(this.id, this.name, this.email, this.jobTitle, this.company, 
				this.location, this.about, 
				this.picture != null ? Base64.getDecoder().decode(this.picture) : null, 
				totalExpValue, this.skills, this.experiences, this.certifications, this.savedJobs);
	}
	
	/**
	 * Get total experience in years (handles both old and new fields)
	 */
	public Integer getTotalExpYears() {
		if (totalExpYears != null) {
			return totalExpYears;
		}
		if (totalExp != null) {
			return totalExp.intValue();
		}
		return 0;
	}
}
