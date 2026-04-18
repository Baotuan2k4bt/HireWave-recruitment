package com.example.hirewave.service;

import com.example.hirewave.Enum.ApplicationStatus;
import com.example.hirewave.Enum.JobStatus;
import com.example.hirewave.dto.*;
import com.example.hirewave.entity.Applicant;
import com.example.hirewave.entity.Company;
import com.example.hirewave.entity.Job;
import com.example.hirewave.entity.User;
import com.example.hirewave.exception.HireWaveException;
import com.example.hirewave.repository.ICompanyRepository;
import com.example.hirewave.repository.IJobRepository;
import com.example.hirewave.repository.IUserRepository;
import com.example.hirewave.service.AIMatching.IMatchingService;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service("jobService")
public class JobServiceImpl implements JobService {

	private static final Logger logger = LoggerFactory.getLogger(JobServiceImpl.class);

	@Autowired
	private IJobRepository IJobRepository;

	@Autowired
	private ICompanyRepository companyRepository;

	@Autowired
	private NotificationService notificationService;

	@Autowired
	private JavaMailSender mailSender;

	@Autowired
	private IUserRepository userRepository;

	@Autowired
	private com.example.hirewave.repository.IProfileRepository profileRepository;

	@Autowired
	private ResumeParser resumeParser;

	@Autowired
	private PdfGeneratorService pdfGeneratorService;
	@Autowired
	private IMatchingService  matchingService;

	@Caching(evict = {
			@CacheEvict(value = "jobs_list", allEntries = true),
			@CacheEvict(value = "jobs_page", allEntries = true),

	})
	@Override
	@Transactional
	public JobDTO postJob(JobDTO jobDTO) throws HireWaveException {

		// ======================
		// CREATE
		// ======================
		if (jobDTO.getId() == null || jobDTO.getId() == 0) {

			Job job = jobDTO.toEntity();

			// Set Company
			if (jobDTO.getCompanyId() != null) {
				Company company = companyRepository.findById(jobDTO.getCompanyId())
						.orElseThrow(() -> new HireWaveException("COMPANY_NOT_FOUND"));
				job.setCompany(company);
			}

			job.setPostTime(LocalDateTime.now());
			job.setJobStatus(JobStatus.PENDING);

			Job savedJob = IJobRepository.save(job);

			NotificationDTO notiDto = new NotificationDTO();
			notiDto.setAction("Job Posted");
			notiDto.setMessage("Job Posted Successfully for "
					+ savedJob.getJobTitle() + " at " + (savedJob.getCompany() != null ? savedJob.getCompany().getName() : "Unknown"));
			notiDto.setUserId(savedJob.getPostedBy());
			notiDto.setRoute("/posted-jobs/" + savedJob.getId());

			notificationService.sendNotification(notiDto);

			return savedJob.toDTO();
		}

		// ======================
		// UPDATE
		// ======================
		Job existingJob = IJobRepository.findById(jobDTO.getId())
				.orElseThrow(() -> new HireWaveException("JOB_NOT_FOUND"));

		existingJob.setJobTitle(jobDTO.getJobTitle());
		existingJob.setDescription(jobDTO.getDescription());
		existingJob.setPackageOffered(jobDTO.getPackageOffered());
		existingJob.setLocation(jobDTO.getLocation());

		// Update Company if changed
		if (jobDTO.getCompanyId() != null) {
			Company company = companyRepository.findById(jobDTO.getCompanyId())
					.orElseThrow(() -> new HireWaveException("COMPANY_NOT_FOUND"));
			existingJob.setCompany(company);
		}

		existingJob.setJobStatus(jobDTO.getJobStatus());

		return IJobRepository.save(existingJob).toDTO();
	}


	@Transactional(readOnly = true)
	public List<JobDTO> getAllJobs(Long userId) throws HireWaveException {
		List<Job> jobs = IJobRepository.findByJobStatus(JobStatus.ACTIVE);
		if (jobs.isEmpty()) {
			return List.of();
		}
		return jobs.stream()
				.map(job -> {
					JobDTO dto = job.toDTO();
					if (userId != null) {
						// Need to check if user has applied to this job
						// Since toDTO doesn't load applicants, we need to fetch separately
						boolean hasApplied = IJobRepository.findApplicantByJobAndApplicantId(job.getId(), userId)
								.isPresent();
						dto.setHasApplied(hasApplied);
					} else {
						dto.setHasApplied(false);
					}
					return dto;
				})
				.collect(Collectors.toList());
	}

	@Override
	@Transactional(readOnly = true)
	public Page<JobDTO> getAllJobs(Pageable pageable, Long userId) throws HireWaveException {
		System.out.println("CALL DB getAllJobs pageable");

		Page<Job> jobsPage = IJobRepository.findAll(pageable);
		if (jobsPage.isEmpty()) {
			return Page.empty(pageable);
		}
		return jobsPage.map(job -> {
			JobDTO dto = job.toDTO();
			if (userId != null) {
				boolean hasApplied = IJobRepository.findApplicantByJobAndApplicantId(job.getId(), userId)
						.isPresent();
				dto.setHasApplied(hasApplied);
			} else {
				dto.setHasApplied(false);
			}
			return dto;
		});

	}

	@Override
	@Transactional(readOnly = true)
	public JobDTO getJob(Long id, Long userId, com.example.hirewave.Enum.AccountType requesterRole) throws HireWaveException {
		// Nếu là EMPLOYER hoặc ADMIN thì dùng toDetailDTO để xem danh sách ứng viên
		if (com.example.hirewave.Enum.AccountType.EMPLOYER.equals(requesterRole) ||
				com.example.hirewave.Enum.AccountType.ADMIN.equals(requesterRole)) {

			return IJobRepository.findByIdWithApplicants(id)
					.map(job -> {
						JobDTO dto = job.toDetailDTO();
						// For employer/admin, không cần set hasApplied
						dto.setHasApplied(false);
						return dto;
					})
					.orElseThrow(() -> new HireWaveException("JOB_NOT_FOUND"));
		}

		// Nếu là APPLICANT (hoặc khách) thì dùng findByIdWithApplicants để load applicants (lazy) và set hasApplied
		return IJobRepository.findByIdWithApplicants(id)
				.map(job -> {
					JobDTO dto = job.toDTO();
					// Set hasApplied flag if userId has applied to this job
					if (userId != null && job.getApplicants() != null) {
						boolean hasApplied = job.getApplicants().stream()
								.anyMatch(a -> a.getApplicantId().equals(userId));
						dto.setHasApplied(hasApplied);
					} else {
						dto.setHasApplied(false);
					}
					return dto;
				})
				.orElseThrow(() -> new HireWaveException("JOB_NOT_FOUND"));
	}

	@Override
	@Transactional
	public void applyJob(Long id, ApplicantDTO applicantDTO) throws HireWaveException {

		Job job = IJobRepository.findById(id)
				.orElseThrow(() -> new HireWaveException("JOB_NOT_FOUND"));

		User user = userRepository.findById(applicantDTO.getApplicantId())
				.orElseThrow(() -> new HireWaveException("USER_NOT_FOUND"));

		List<Applicant> applicants = job.getApplicants();
		if (applicants == null) {
			applicants = new ArrayList<>();
		}

		// =============================
		// Check if already applied
		// =============================
		boolean alreadyApplied = applicants.stream()
				.anyMatch(x -> x.getApplicantId().equals(applicantDTO.getApplicantId()));

		if (alreadyApplied) {
			throw new HireWaveException("JOB_APPLIED_ALREADY");
		}

		// =============================
		// Process resume
		// =============================
		if (applicantDTO.getResume() != null) {
			try {

				byte[] resumeData = Base64.getDecoder().decode(applicantDTO.getResume());

				Map<String, Object> parsedInfo =
						resumeParser.parseResume(resumeData);

				byte[] extractedPdf =
						pdfGeneratorService.generateExtractedPdf(parsedInfo);

				applicantDTO.setExtractedResume(
						Base64.getEncoder().encodeToString(extractedPdf)
				);

			} catch (IOException e) {
				throw new HireWaveException("Failed to process resume: " + e.getMessage());
			}
		}

		// =============================
		// Create Applicant
		// =============================
		Applicant applicant = new Applicant();

		applicant.setApplicantId(applicantDTO.getApplicantId());
		applicant.setName(user.getName());
		applicant.setEmail(user.getEmail());
		applicant.setPhone(applicantDTO.getPhone());
		applicant.setWebsite(applicantDTO.getWebsite());

		applicant.setResume(
				applicantDTO.getResume() != null ?
						Base64.getDecoder().decode(applicantDTO.getResume()) :
						null
		);

		applicant.setExtractedResume(
				applicantDTO.getExtractedResume() != null ?
						Base64.getDecoder().decode(applicantDTO.getExtractedResume()) :
						null
		);

		applicant.setCoverLetter(applicantDTO.getCoverLetter());
		applicant.setApplicationStatus(ApplicationStatus.APPLIED);
		applicant.setTimestamp(LocalDateTime.now());

		applicant.setJob(job);

		// =============================
		// Save applicant
		// =============================
		applicants.add(applicant);
		job.setApplicants(applicants);

		Job savedJob = IJobRepository.save(job);

		logger.info("Job saved with id: {}", savedJob.getId());
		logger.info("Applicant before flush - applicantId: {}, applicant.id: {}", applicant.getApplicantId(), applicant.getId());

		// IMPORTANT: Flush to generate applicant.id before AI matching
		// Because calculateAndSaveMatching needs applicant.getId()
		IJobRepository.flush();

		logger.info("After flush - applicant.id: {}", applicant.getId());

		// =============================
		// AI Matching calculation
		// =============================
		try {

			// If applicant.id is still null after flush, try to reload from DB
			if (applicant.getId() == null) {
				logger.warn("Applicant.id is null after flush, attempting to reload...");
				Optional<Applicant> persistedApplicant = IJobRepository.findApplicantByJobAndApplicantId(
						savedJob.getId(), applicant.getApplicantId());
				if (persistedApplicant.isPresent()) {
					Applicant reloadedApplicant = persistedApplicant.get();
					logger.info("Reloaded applicant with id: {}", reloadedApplicant.getId());
					applicant = reloadedApplicant;
				} else {
					logger.error("Could not reload applicant from database! Skipping AI matching.");
					return;
				}
			}

			logger.info("Starting AI matching for applicantId={}, applicant.id={}, jobId={}",
					applicant.getApplicantId(), applicant.getId(), savedJob.getId());
			matchingService.calculateAndSaveMatching(
					applicant,
					savedJob
			);
			logger.info("AI matching completed for applicantId={}, jobId={}", applicant.getId(), savedJob.getId());

		} catch (Exception e) {

			logger.error(
					"AI matching failed for applicant {} (applicantId={}), job {}",
					applicant.getApplicantId(),
					applicant.getId(),
					savedJob.getId(),
					e
			);
		}

		// =============================
		// Send email
		// =============================
		sendApplicationEmailAsync(
				user.getEmail(),
				savedJob
		);
	}

	@Override
	@Transactional(readOnly = true)
	public List<JobDTO> getHistory(Long id, ApplicationStatus applicationStatus) {
		// Defensive: UI thường cần hiển thị lịch sử ứng tuyển (Applied/Interviewing/Hired/Rejected...)
		// Nếu query trả về rỗng thì trả về list rỗng, không throw để tránh UI "không hiển thị".
		if (id == null) {
			return List.of();
		}
		return IJobRepository.findByApplicantIdAndApplicationStatus(id, applicationStatus)
				.stream()
				.map(Job::toDTO)
				.toList();
	}

	@Override
	@Transactional(readOnly = true)
	public List<JobDTO> getJobsPostedBy(Long id) throws HireWaveException {
		// Nhà tuyển dụng xem danh sách job họ đã đăng -> dùng toDTO (không cần applicants ở list)
		return IJobRepository.findByPostedBy(id).stream().map(Job::toDTO).toList();
	}

	@Override
	@Transactional(readOnly = true)
	public List<JobDTO> getPendingJobsPostedBy(Long employerId) throws HireWaveException {
		List<Job> jobs = IJobRepository.findByPostedByAndJobStatus(employerId, JobStatus.PENDING);
		return jobs.stream()
				.map(Job::toDTO)
				.collect(Collectors.toList());
	}

	@Caching(evict = {
			@CacheEvict(value = "jobs_list", allEntries = true),
			@CacheEvict(value = "jobs_page", allEntries = true),

	})
	@Override
	@Transactional
	public void changeAppStatus(Application application) throws HireWaveException {
		Job job = IJobRepository.findById(application.getId())
				.orElseThrow(() -> new HireWaveException("JOB_NOT_FOUND"));

		Applicant targetApplicant = null;
		for (Applicant applicant : job.getApplicants()) {
			if (applicant.getApplicantId().equals(application.getApplicantId())) {
				targetApplicant = applicant;
				break;
			}
		}

		if (targetApplicant == null) {
			throw new HireWaveException("APPLICANT_NOT_FOUND");
		}

		targetApplicant.setApplicationStatus(application.getApplicationStatus());

		if (application.getApplicationStatus() == ApplicationStatus.INTERVIEWING) {
			targetApplicant.setInterviewTime(application.getInterviewTime());
			sendNotifications(application, job);
		}

		IJobRepository.save(job);

		// Use email from Applicant (denormalized data) to avoid N+1 query
		// Applicant.email is already synced from User when applying
		// Send email asynchronously to avoid blocking transaction
		sendStatusUpdateEmailAsync(targetApplicant.getEmail(), job, application.getApplicationStatus());
	}
	@Caching(evict = {
			@CacheEvict(value = "jobs_list", allEntries = true),
			@CacheEvict(value = "jobs_page", allEntries = true),

	})
	@Override
	@Transactional
	public void deleteJob(Long id) throws HireWaveException {
		IJobRepository.deleteById(id);
	}

	@Override
	@Transactional(readOnly = true)
	public List<JobDTO> getSavedJobs(Long profileId) throws HireWaveException {
		com.example.hirewave.entity.Profile profile = profileRepository.findById(profileId)
				.orElseThrow(() -> new HireWaveException("PROFILE_NOT_FOUND"));

		List<Long> savedJobIds = profile.getSavedJobs();
		if (savedJobIds == null || savedJobIds.isEmpty()) {
			return new ArrayList<>();
		}

		return IJobRepository.findAllById(savedJobIds).stream()
				.map(Job::toDTO)
				.collect(Collectors.toList());
	}
	private void sendNotifications(Application application, Job job) {
		NotificationDTO notiDto = new NotificationDTO();
		notiDto.setAction("Interview Scheduled");
		notiDto.setMessage("Interview scheduled for job id: " + application.getId());
		notiDto.setUserId(application.getApplicantId());
		notiDto.setRoute("/job-history");
		try {
			notificationService.sendNotification(notiDto);
		} catch (HireWaveException e) {
			logger.error("Failed to send notification for application {}: {}", application.getId(), e.getMessage(), e);
		}
	}

	@Async("emailExecutor")
	public void sendApplicationEmailAsync(String email, Job job) {
		try {
			sendApplicationEmail(email, job);
		} catch (HireWaveException e) {
			logger.error("Failed to send application email to {}: {}", email, e.getMessage(), e);
		}
	}

	private void sendApplicationEmail(String email, Job job) throws HireWaveException {
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true);
			helper.setTo(email);
			helper.setSubject("Job Application Confirmation");
			String companyName = (job.getCompany() != null) ? job.getCompany().getName() : "HireWave";
			String htmlContent = String.format("""
                <html>
                <body>
                    <h2>Application Confirmation</h2>
                    <p>Your application for the position of <strong>%s</strong> at <strong>%s</strong> has been received.</p>
                    <p>We will review your application and get back to you soon.</p>
                    <p>Thank you for your interest!</p>
                </body>
                </html>
                """, job.getJobTitle(), companyName);
			helper.setText(htmlContent, true);
			mailSender.send(message);
		} catch (Exception e) {
			throw new HireWaveException("Failed to send application confirmation email: " + e.getMessage());
		}
	}

	@Async("emailExecutor")
	public void sendStatusUpdateEmailAsync(String email, Job job, ApplicationStatus status) {
		try {
			sendStatusUpdateEmail(email, job, status);
		} catch (HireWaveException e) {
			logger.error("Failed to send status update email to {}: {}", email, e.getMessage(), e);
		}
	}

	private void sendStatusUpdateEmail(String email, Job job, ApplicationStatus status) throws HireWaveException {
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true);
			helper.setTo(email);
			helper.setSubject("Application Status Update");
			String companyName = (job.getCompany() != null) ? job.getCompany().getName() : "HireWave";
			String htmlContent = String.format("""
                <html>
                <body>
                    <h2>Application Status Update</h2>
                    <p>Your application for the position of <strong>%s</strong> at <strong>%s</strong> has been updated.</p>
                    <p>New status: <strong>%s</strong></p>
                    %s
                </body>
                </html>
                """,
					job.getJobTitle(),
					companyName,
					status,
					status == ApplicationStatus.INTERVIEWING ?
							"<p>Please check your notifications for interview details.</p>" : "");
			helper.setText(htmlContent, true);
			mailSender.send(message);
		} catch (Exception e) {
			throw new HireWaveException("Failed to send status update email: " + e.getMessage());
		}
	}
	@Override
	@Transactional(readOnly = true)
	public Job getJobWithApplicant(Long jobId, Long applicantId) throws HireWaveException {
		return IJobRepository.findById(jobId)
				.orElseThrow(() -> new HireWaveException("JOB_NOT_FOUND"));
	}
	@Override
	@Transactional(readOnly = true)
	public List<JobDTO> getPendingJobs() throws HireWaveException {
		List<Job> jobs = IJobRepository.findByJobStatus(JobStatus.PENDING);
		return jobs.stream()
				.map(Job::toDTO)
				.collect(Collectors.toList());
	}
	@Caching(evict = {
			@CacheEvict(value = "jobs_list", allEntries = true),
			@CacheEvict(value = "jobs_page", allEntries = true),

	})
	@Override
	@Transactional
	public void approveJob(Long id) throws HireWaveException {
		Job job = IJobRepository.findById(id)
				.orElseThrow(() -> new HireWaveException("JOB_NOT_FOUND"));

		job.setJobStatus(JobStatus.ACTIVE);
		IJobRepository.save(job);

		NotificationDTO notification = new NotificationDTO();
		notification.setUserId(job.getPostedBy());
		notification.setAction("Job Approved");
		notification.setMessage("Your job posting for " + job.getJobTitle() + " has been approved");
		notification.setRoute("/posted-jobs/" + job.getId());
		notificationService.sendNotification(notification);
	}
	@Caching(evict = {
			@CacheEvict(value = "jobs_list", allEntries = true),
			@CacheEvict(value = "jobs_page", allEntries = true),

	})
	@Override
	@Transactional
	public void rejectJob(Long id) throws HireWaveException {
		Job job = IJobRepository.findById(id)
				.orElseThrow(() -> new HireWaveException("JOB_NOT_FOUND"));

		job.setJobStatus(JobStatus.REJECTED);
		IJobRepository.save(job);
		NotificationDTO notification = new NotificationDTO();
		notification.setUserId(job.getPostedBy());
		notification.setAction("Job Rejected");
		notification.setMessage("Your job posting for " + job.getJobTitle() + " has been rejected");
		notification.setRoute("/posted-jobs/" + job.getId());
		notificationService.sendNotification(notification);
	}
}
