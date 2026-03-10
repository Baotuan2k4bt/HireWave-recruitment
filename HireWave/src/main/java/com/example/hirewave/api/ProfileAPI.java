package com.example.hirewave.api;


import com.example.hirewave.dto.ProfileDTO;
import com.example.hirewave.exception.HireWaveException;
import com.example.hirewave.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin
@RequestMapping("/profiles")
@Validated
public class ProfileAPI {
	
	@Autowired
	private ProfileService profileService;
	@GetMapping("/get/{id}")
	public ResponseEntity<ProfileDTO>getProfile(@PathVariable Long id) throws HireWaveException {
		return new ResponseEntity<>(profileService.getProfile(id), HttpStatus.OK);
	}
	@GetMapping("/getAll")
	public ResponseEntity<List<ProfileDTO>>getAllProfiles() throws HireWaveException {
		return new ResponseEntity<>(profileService.getAllProfiles(), HttpStatus.OK);
	}
	@PutMapping("/update")
	public ResponseEntity<ProfileDTO>updateProfile(@RequestBody ProfileDTO profileDTO) throws HireWaveException {
		return new ResponseEntity<>(profileService.updateProfile(profileDTO), HttpStatus.OK);
	}
	
	@GetMapping("/getAll/paged")
	public ResponseEntity<org.springframework.data.domain.Page<ProfileDTO>>getAllProfilesPaged(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size,
			@RequestParam(defaultValue = "id") String sortBy) throws HireWaveException {
		org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size, 
				org.springframework.data.domain.Sort.Direction.DESC, sortBy);
		return new ResponseEntity<>(profileService.getAllProfiles(pageable), HttpStatus.OK);
	}
	
}
