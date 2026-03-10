package com.example.hirewave.repository;

import com.example.hirewave.entity.Applicant;
import com.example.hirewave.entity.Job;
import com.example.hirewave.entity.MatchingResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * Repository for MatchingResult entity
 * Provides queries for AI matching results
 */
public interface IMatchingResultRepository extends JpaRepository<MatchingResult, Long> {
	Optional<MatchingResult> findByApplication(Applicant application);

	List<MatchingResult> findByJobOrderByMatchingScoreDesc(Job job);
	/**
	 * Find matching result by application ID
	 */
	@Query("SELECT mr FROM MatchingResult mr WHERE mr.application.id = :applicationId")
	Optional<MatchingResult> findByApplicationId(@Param("applicationId") Long applicationId);

	/**
	 * Find all matching results for a specific job, ordered by score descending
	 */
	@Query("SELECT mr FROM MatchingResult mr WHERE mr.job.id = :jobId ORDER BY mr.matchingScore DESC")
	List<MatchingResult> findByJobIdOrderByScoreDesc(@Param("jobId") Long jobId);

	/**
	 * Find all matching results for a specific applicant/user
	 */
	@Query("SELECT mr FROM MatchingResult mr WHERE mr.application.applicantId = :applicantId ORDER BY mr.matchingScore DESC")
	List<MatchingResult> findByApplicantIdOrderByScoreDesc(@Param("applicantId") Long applicantId);

	/**
	 * Find top N matching results for a job
	 * Note: Use Pageable instead of LIMIT for better Spring Data JPA support
	 */
	List<MatchingResult> findByJobIdOrderByMatchingScoreDesc(Long jobId, org.springframework.data.domain.Pageable pageable);

	/**
	 * Check if matching result exists for application
	 */
	boolean existsByApplicationId(Long applicationId);


}
