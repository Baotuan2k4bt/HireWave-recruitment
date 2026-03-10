package com.example.hirewave.service;

import com.example.hirewave.dto.ApplicantDTO;
import com.example.hirewave.dto.Application;
import com.example.hirewave.Enum.ApplicationStatus;
import com.example.hirewave.dto.JobDTO;
import com.example.hirewave.entity.Job;
import com.example.hirewave.exception.HireWaveException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;


public interface JobService {

    JobDTO postJob(JobDTO jobDTO) throws HireWaveException;

    List<JobDTO> getAllJobs(Long userId) throws HireWaveException;

    Page<JobDTO> getAllJobs(Pageable pageable, Long userId) throws HireWaveException;

    JobDTO getJob(Long id, Long userId, com.example.hirewave.Enum.AccountType requesterRole) throws HireWaveException;

    void applyJob(Long id, ApplicantDTO applicantDTO) throws HireWaveException;

    List<JobDTO> getHistory(Long id, ApplicationStatus applicationStatus);

    List<JobDTO> getJobsPostedBy(Long id) throws HireWaveException;

    void changeAppStatus(Application application) throws HireWaveException;

	void deleteJob(Long id) throws HireWaveException;
    Job getJobWithApplicant(Long jobId, Long applicantId) throws HireWaveException;
    List<JobDTO> getPendingJobs() throws HireWaveException;
    void approveJob(Long id) throws HireWaveException;
    void rejectJob(Long id) throws HireWaveException;
    List<JobDTO> getSavedJobs(Long profileId) throws HireWaveException;

    List<JobDTO> getPendingJobsPostedBy(Long employerId) throws HireWaveException;
}
