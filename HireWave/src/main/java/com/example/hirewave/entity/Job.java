package com.example.hirewave.entity;

import com.example.hirewave.dto.JobDTO;
import com.example.hirewave.Enum.JobStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "jobs", indexes = {
        @Index(name = "idx_job_postedby", columnList = "postedBy"),
        @Index(name = "idx_job_status", columnList = "job_status"),
        @Index(name = "idx_job_postedby_status", columnList = "postedBy,job_status")
})
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String jobTitle;

    // Company is accessed in multiple places (DTO mapping, email notifications) even
    // after the Job entity may be detached, so we load it eagerly to avoid
    // LazyInitializationException in those flows.
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id")
    private Company company;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Applicant> applicants;

    @Column(length = 3000)

    private String about;
    private String experience;
    private String jobType;
    private String location;
    private String packageOffered;
    private LocalDateTime postTime;

    @Column(length = 3000)
    private String description;
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "job_skills_required",
            joinColumns = @JoinColumn(name = "job_id"))
    private List<String> skillsRequired;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_status")
    private JobStatus jobStatus = JobStatus.PENDING;

    private Long postedBy;

    public JobDTO toDTO() {
        JobDTO dto = new JobDTO();
        dto.setId(this.id);
        dto.setJobTitle(this.jobTitle);
        dto.setCompanyId(this.company != null ? this.company.getId() : null);
        dto.setCompanyName(this.company != null ? this.company.getName() : null);
        dto.setCompanyLogo(this.company != null ? this.company.getLogoUrl() : null);

        // Quan trọng: không map applicants trong DTO list.
        dto.setApplicants(null);

        dto.setAbout(this.about);
        dto.setExperience(this.experience);
        dto.setJobType(this.jobType);
        dto.setLocation(this.location);
        dto.setPackageOffered(this.packageOffered);
        dto.setPostTime(this.postTime);
        dto.setDescription(this.description);
        dto.setSkillsRequired(this.skillsRequired);
        dto.setJobStatus(this.jobStatus);
        dto.setPostedBy(this.postedBy);
        return dto;
    }


    public JobDTO toDetailDTO() {
        JobDTO dto = this.toDTO();
        dto.setApplicants(this.applicants != null
                ? this.applicants.stream().map(Applicant::toDTO).toList()
                : java.util.List.of());
        return dto;
    }
}