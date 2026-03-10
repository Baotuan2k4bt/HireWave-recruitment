package com.example.hirewave.service;
import com.example.hirewave.dto.ProfileDTO;
import com.example.hirewave.dto.UserDTO;
import com.example.hirewave.exception.HireWaveException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProfileService {
	Long createProfile(UserDTO userDTO) throws HireWaveException;

	ProfileDTO getProfile(Long id) throws HireWaveException;

	ProfileDTO updateProfile(ProfileDTO profileDTO) throws HireWaveException;

	List<ProfileDTO> getAllProfiles() throws HireWaveException;
	
	Page<ProfileDTO> getAllProfiles(Pageable pageable) throws HireWaveException;

}
