package com.example.hirewave.service;

import com.example.hirewave.dto.ProfileDTO;
import com.example.hirewave.dto.UserDTO;
import com.example.hirewave.entity.Profile;
import com.example.hirewave.exception.HireWaveException;
import com.example.hirewave.repository.IProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service("profileService")
public class ProfileServiceImpl implements ProfileService {

	@Autowired
	private IProfileRepository IProfileRepository;

	@Override
	public Long createProfile(UserDTO userDTO) throws HireWaveException {
		Profile profile = new Profile();
		profile.setEmail(userDTO.getEmail());
		profile.setName(userDTO.getName());
		profile.setSkills(new ArrayList<>());
		profile.setExperiences(new ArrayList<>());
		profile.setCertifications(new ArrayList<>());
		Profile savedProfile = IProfileRepository.save(profile);
		return savedProfile.getId();
	}

	@Override
	public ProfileDTO getProfile(Long id) throws HireWaveException {
		return IProfileRepository.findById(id)
				.orElseThrow(() -> new HireWaveException("PROFILE_NOT_FOUND")).toDTO();
	}

	@Override
	public ProfileDTO updateProfile(ProfileDTO profileDTO) throws HireWaveException {
		// Defensive check to avoid repository calls with a null id
		if (profileDTO.getId() == null) {
			throw new HireWaveException("PROFILE_ID_REQUIRED");
		}

		Profile existingProfile = IProfileRepository.findById(profileDTO.getId())
				.orElseThrow(() -> new HireWaveException("PROFILE_NOT_FOUND"));

		// Convert DTO to entity while preserving critical immutable fields if missing
		Profile profileToSave = profileDTO.toEntity();
		if (profileToSave.getEmail() == null) {
			profileToSave.setEmail(existingProfile.getEmail());
		}

		Profile saved = IProfileRepository.save(profileToSave);
		return saved.toDTO();
	}

	@Override
	public List<ProfileDTO> getAllProfiles() throws HireWaveException {
		return IProfileRepository.findAll().stream().map((x) -> x.toDTO()).toList();
	}
	
	@Override
	public Page<ProfileDTO> getAllProfiles(Pageable pageable) throws HireWaveException {
		Page<Profile> profilesPage = IProfileRepository.findAll(pageable);
		return profilesPage.map(Profile::toDTO);
	}
}