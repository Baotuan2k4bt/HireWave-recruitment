package com.example.hirewave.repository;


import com.example.hirewave.Enum.ApplicationStatus;
import com.example.hirewave.Enum.JobStatus;
import com.example.hirewave.entity.Applicant;
import com.example.hirewave.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IJobRepository extends JpaRepository<Job, Long> {
	@Query("SELECT j FROM Job j JOIN j.applicants a WHERE a.applicantId = :applicantId AND a.applicationStatus = :status")
	List<Job> findByApplicantIdAndApplicationStatus(@Param("applicantId") Long applicantId,
													@Param("status") ApplicationStatus applicationStatus);

	@Query("SELECT j FROM Job j LEFT JOIN FETCH j.applicants WHERE j.postedBy = :postedBy")
	List<Job> findByPostedBy(@Param("postedBy") Long postedBy);

	@Query("SELECT j FROM Job j LEFT JOIN FETCH j.applicants WHERE j.jobStatus = :jobStatus")
	List<Job> findByJobStatus(@Param("jobStatus") JobStatus jobStatus);

	// Optimized query: Load jobs with applicants using JOIN FETCH to avoid N+1
	@Query("SELECT DISTINCT j FROM Job j LEFT JOIN FETCH j.applicants WHERE j.jobStatus = :status")
	List<Job> findByJobStatusWithApplicants(@Param("status") JobStatus jobStatus);

	// Optimized query: Load job with applicants using JOIN FETCH
	@Query("SELECT DISTINCT j FROM Job j LEFT JOIN FETCH j.applicants WHERE j.id = :id")
	java.util.Optional<Job> findByIdWithApplicants(@Param("id") Long id);

	// Optimized query: Load jobs posted by user with applicants
	@Query("SELECT DISTINCT j FROM Job j LEFT JOIN FETCH j.applicants WHERE j.postedBy = :postedBy")
	List<Job> findByPostedByWithApplicants(@Param("postedBy") Long postedBy);

	@Query("SELECT j FROM Job j WHERE j.postedBy = :postedBy AND j.jobStatus = :jobStatus")
	List<Job> findByPostedByAndJobStatus(@Param("postedBy") Long postedBy, @Param("jobStatus") JobStatus jobStatus);

	// Find applicant by job ID and applicant ID (userId)
	@Query("SELECT a FROM Applicant a WHERE a.job.id = :jobId AND a.applicantId = :applicantId")
	Optional<Applicant> findApplicantByJobAndApplicantId(@Param("jobId") Long jobId, @Param("applicantId") Long applicantId);

}