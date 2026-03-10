package com.example.hirewave.api;

import com.example.hirewave.Enum.ApplicationStatus;
import com.example.hirewave.dto.*;
import com.example.hirewave.entity.Profile;
import com.example.hirewave.exception.HireWaveException;
import com.example.hirewave.repository.IProfileRepository;
import com.example.hirewave.service.ApplicantService;
import com.example.hirewave.service.JobService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/jobs")
@Validated
public class JobAPI {

	@Autowired
	private JobService jobService;
	@Autowired
	private IProfileRepository profileRepository;
	@PostMapping("/post")
	public ResponseEntity<JobDTO>postJob(@RequestBody @Valid JobDTO jobDTO) throws HireWaveException {
		return new ResponseEntity<>(jobService.postJob(jobDTO), HttpStatus.CREATED);
	}


	@PostMapping("/postAll")
	public ResponseEntity<Map<String, Object>>postAllJob(@RequestBody @Valid List<JobDTO> jobDTOs) throws HireWaveException {
		List<JobDTO> successful = new ArrayList<>();
		List<Map<String, String>> errors = new ArrayList<>();

		for (JobDTO jobDTO : jobDTOs) {
			try {
				JobDTO savedJob = jobService.postJob(jobDTO);
				successful.add(savedJob);
			} catch (HireWaveException e) {
				Map<String, String> error = new HashMap<>();
				error.put("jobTitle", jobDTO.getJobTitle() != null ? jobDTO.getJobTitle() : "Unknown");
				error.put("error", e.getMessage());
				errors.add(error);
			}
		}

		Map<String, Object> result = new HashMap<>();
		result.put("successful", successful);
		result.put("errors", errors);
		result.put("total", jobDTOs.size());
		result.put("successCount", successful.size());
		result.put("errorCount", errors.size());

		HttpStatus status = errors.isEmpty() ? HttpStatus.CREATED :
				successful.isEmpty() ? HttpStatus.BAD_REQUEST : HttpStatus.MULTI_STATUS;
		return new ResponseEntity<>(result, status);
	}

	@GetMapping("/getAll")
	public ResponseEntity<List<JobDTO>>getAllJobs() throws HireWaveException {
		Long userId = getCurrentUserId();
		return new ResponseEntity<>(jobService.getAllJobs(userId), HttpStatus.OK);
	}

	@GetMapping("/getAll/paged")
	public ResponseEntity<org.springframework.data.domain.Page<JobDTO>>getAllJobsPaged(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size,
			@RequestParam(defaultValue = "id") String sortBy) throws HireWaveException {
		Long userId = getCurrentUserId();
		org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size,
				org.springframework.data.domain.Sort.Direction.DESC, sortBy);
		return new ResponseEntity<>(jobService.getAllJobs(pageable, userId), HttpStatus.OK);
	}

	private Long getCurrentUserId() {
		org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
		if (auth != null && auth.getPrincipal() instanceof com.example.hirewave.jwt.CustomUserDetails userDetails) {
			return userDetails.getId();
		}
		return null;
	}
	@GetMapping("/get/{id}")
	public ResponseEntity<JobDTO> getJob(@PathVariable Long id) throws HireWaveException {
		com.example.hirewave.Enum.AccountType role = null;
		Long userId = null;
		org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
		if (auth != null && auth.getPrincipal() instanceof com.example.hirewave.jwt.CustomUserDetails userDetails) {
			role = userDetails.getAccountType();
			userId = userDetails.getId();
		}
		return new ResponseEntity<>(jobService.getJob(id, userId, role), HttpStatus.OK);
	}
	@PostMapping("apply/{id}")
	public ResponseEntity<ResponseDTO> applyJob(
			@PathVariable Long id,
			@RequestBody ApplicantDTO applicantDTO,
			@AuthenticationPrincipal com.example.hirewave.jwt.CustomUserDetails userDetails
	) throws HireWaveException {

		String email = userDetails.getUsername();

		Profile profile = profileRepository.findByEmail(email);

		applicantDTO.setApplicantId(profile.getId());

		jobService.applyJob(id, applicantDTO);

		return new ResponseEntity<>(new ResponseDTO("Applied Successfully"), HttpStatus.OK);
	}
	@GetMapping("/postedBy/{id}")
	public ResponseEntity<List<JobDTO>>getJobsPostedBy(@PathVariable Long id) throws HireWaveException {
		return new ResponseEntity<>(jobService.getJobsPostedBy(id), HttpStatus.OK);
	}

	@GetMapping("/history/{id}/{applicationStatus}")
	public ResponseEntity<List<JobDTO>>getHistory(@PathVariable Long id,@PathVariable ApplicationStatus applicationStatus) throws HireWaveException {
		return new ResponseEntity<>(jobService.getHistory(id, applicationStatus), HttpStatus.OK);
	}
	@PostMapping("/changeAppStatus")
	public ResponseEntity<ResponseDTO>changeAppStatus(@RequestBody Application application) throws HireWaveException {
		jobService.changeAppStatus(application);
		return new ResponseEntity<>(new ResponseDTO("Status Changed Successfully"), HttpStatus.OK);
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<ResponseDTO>deleteJob(@PathVariable Long id) throws HireWaveException{
		jobService.deleteJob(id);
		return new ResponseEntity<>(new ResponseDTO("Delete Successfully"),HttpStatus.OK);
	}

	@GetMapping("/saved/{profileId}")
	public ResponseEntity<List<JobDTO>> getSavedJobs(@PathVariable Long profileId) throws HireWaveException {
		return new ResponseEntity<>(jobService.getSavedJobs(profileId), HttpStatus.OK);
	}

	@GetMapping("/employer/pending-jobs")
	public ResponseEntity<List<JobDTO>> getEmployerPendingJobs(
			@AuthenticationPrincipal com.example.hirewave.jwt.CustomUserDetails userDetails) throws HireWaveException {

		List<JobDTO> pendingJobs = jobService.getPendingJobsPostedBy(userDetails.getId());
		return new ResponseEntity<>(pendingJobs, HttpStatus.OK);
	}
}
