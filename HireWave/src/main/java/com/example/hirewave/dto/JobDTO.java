package com.example.hirewave.dto;

import com.example.hirewave.Enum.ExperienceLevel;
import com.example.hirewave.Enum.JobStatus;
import com.example.hirewave.entity.Job;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobDTO {

	private Long id;
	private String jobTitle;

	// 🔥 Thay company String bằng 2 field rõ ràng
	private Long companyId;
	private String companyName;
	private String companyLogo;

	private List<ApplicantDTO> applicants;
	private String about;

	// ✅ Flag to indicate if current user has applied to this job
	private Boolean hasApplied = false;

	// Legacy field
	private String experience;

	// Structured experience fields
	private Integer minExperience;
	private Integer maxExperience;
	private ExperienceLevel experienceLevel;

	private String jobType;
	private String location;
	private String packageOffered;
	private LocalDateTime postTime;
	private String description;

	private List<String> skillsRequired;
	private List<String> primarySkills;
	private List<String> niceToHaveSkills;

	private JobStatus jobStatus;
	private Long postedBy;

	// 🔥 toEntity KHÔNG set company ở đây
	// Company sẽ được set trong Service
	public Job toEntity() {
		Job job = new Job();
		// Chỉ set ID nếu > 0 (UPDATE), nếu là 0 hoặc null thì để Hibernate tự generate
		if (this.id != null && this.id > 0) {
			job.setId(this.id);
		}
		job.setJobTitle(this.jobTitle);
		job.setAbout(this.about);
		job.setExperience(this.experience);
		job.setJobType(this.jobType);
		job.setLocation(this.location);
		job.setPackageOffered(this.packageOffered);
		job.setPostTime(this.postTime);
		job.setDescription(this.description);
		job.setSkillsRequired(this.skillsRequired);
		job.setJobStatus(this.jobStatus);
		job.setPostedBy(this.postedBy);
		return job;
	}

	public ExperienceLevel getEffectiveExperienceLevel() {
		if (experienceLevel != null) {
			return experienceLevel;
		}
		if (minExperience != null) {
			return ExperienceLevel.fromYears(minExperience);
		}
		return ExperienceLevel.JUNIOR;
	}
}