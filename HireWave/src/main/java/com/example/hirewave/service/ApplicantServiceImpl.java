package com.example.hirewave.service;

import com.example.hirewave.dto.ApplicantResponseDTO;
import com.example.hirewave.dto.ApplicantDetailDTO;
import com.example.hirewave.entity.Applicant;
import com.example.hirewave.entity.MatchingResult;
import com.example.hirewave.exception.HireWaveException;
import com.example.hirewave.repository.IApplicantRepository;
import com.example.hirewave.repository.IMatchingResultRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service("applicantService")
public class ApplicantServiceImpl implements ApplicantService {

    private final IApplicantRepository applicantRepository;
    private final IMatchingResultRepository matchingResultRepository;

    public ApplicantServiceImpl(IApplicantRepository applicantRepository,
                               IMatchingResultRepository matchingResultRepository) {
        this.applicantRepository = applicantRepository;
        this.matchingResultRepository = matchingResultRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicantResponseDTO> getApplicantsByJob(Long jobId) throws HireWaveException {
        // 1. Lấy danh sách ứng viên từ repo, sắp xếp mới nhất
        List<Applicant> applicants = applicantRepository.findByJobIdOrderByTimestampDesc(jobId);

        // 2. Map sang ResponseDTO (Lite version)
        return applicants.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicantResponseDTO> getAllApplicants() throws HireWaveException {
        List<Applicant> applicants = applicantRepository.findAllByOrderByTimestampDesc();
        return applicants.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicantDetailDTO getApplicantDetail(Long id) throws HireWaveException {
        // 1. Tìm ứng viên
        Applicant applicant = applicantRepository.findById(id)
                .orElseThrow(() -> new HireWaveException("APPLICANT_NOT_FOUND"));

        // 2. Map sang DetailDTO (Full version)
        return toDetailDTO(applicant);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] getResume(Long id) throws HireWaveException {
        Applicant applicant = applicantRepository.findById(id)
                .orElseThrow(() -> new HireWaveException("APPLICANT_NOT_FOUND"));

        if (applicant.getResume() == null) {
            throw new HireWaveException("RESUME_NOT_FOUND");
        }

        return applicant.getResume();
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] getExtractedResume(Long id) throws HireWaveException {
        Applicant applicant = applicantRepository.findById(id)
                .orElseThrow(() -> new HireWaveException("APPLICANT_NOT_FOUND"));

        if (applicant.getExtractedResume() == null) {
            throw new HireWaveException("EXTRACTED_RESUME_NOT_FOUND");
        }

        return applicant.getExtractedResume();
    }

    /**
     * Chuyển đổi sang ResponseDTO (Không mang dữ liệu Base64 CV nặng)
     */
    private ApplicantResponseDTO toResponseDTO(Applicant applicant) {
        ApplicantResponseDTO dto = new ApplicantResponseDTO();
        dto.setId(applicant.getId());
        dto.setApplicantId(applicant.getApplicantId());
        dto.setJobId(applicant.getJob() != null ? applicant.getJob().getId() : null);
        dto.setProfileId(applicant.getProfileId());
        dto.setName(applicant.getName());
        dto.setEmail(applicant.getEmail());
        dto.setPhone(applicant.getPhone());
        dto.setWebsite(applicant.getWebsite());
        dto.setCoverLetter(applicant.getCoverLetter());
        dto.setTimestamp(applicant.getTimestamp());
        dto.setApplicationStatus(applicant.getApplicationStatus());
        dto.setInterviewTime(applicant.getInterviewTime());

        // Check for CV existence metadata
        dto.setHasResume(applicant.getResume() != null && applicant.getResume().length > 0);
        dto.setHasExtractedResume(applicant.getExtractedResume() != null && applicant.getExtractedResume().length > 0);

        // Include AI Matching fields if result exists
        Optional<MatchingResult> mrOpt = matchingResultRepository.findByApplicationId(applicant.getId());
        if (mrOpt.isPresent()) {
            MatchingResult mr = mrOpt.get();
            dto.setMatchingScore(mr.getMatchingScore());
            dto.setMatchedSkills(parseSkills(mr.getMatchedSkills()));
            dto.setMissingSkills(parseSkills(mr.getMissingSkills()));
        }

        return dto;
    }

    /**
     * Chuyển đổi sang DetailDTO (Có mang dữ liệu Base64 CV)
     */
    private ApplicantDetailDTO toDetailDTO(Applicant applicant) {
        ApplicantDetailDTO dto = new ApplicantDetailDTO();
        dto.setId(applicant.getId());
        dto.setApplicantId(applicant.getApplicantId());
        dto.setJobId(applicant.getJob() != null ? applicant.getJob().getId() : null);
        dto.setProfileId(applicant.getProfileId());
        dto.setName(applicant.getName());
        dto.setEmail(applicant.getEmail());
        dto.setPhone(applicant.getPhone());
        dto.setWebsite(applicant.getWebsite());
        dto.setCoverLetter(applicant.getCoverLetter());
        dto.setTimestamp(applicant.getTimestamp());
        dto.setApplicationStatus(applicant.getApplicationStatus());
        dto.setInterviewTime(applicant.getInterviewTime());

        // Fill Base64 content
        dto.setResume(applicant.getResume() != null ?
                Base64.getEncoder().encodeToString(applicant.getResume()) : null);
        dto.setExtractedResume(applicant.getExtractedResume() != null ?
                Base64.getEncoder().encodeToString(applicant.getExtractedResume()) : null);

        // AI Matching fields
        Optional<MatchingResult> mrOpt = matchingResultRepository.findByApplicationId(applicant.getId());
        if (mrOpt.isPresent()) {
            MatchingResult mr = mrOpt.get();
            dto.setMatchingScore(mr.getMatchingScore());
            dto.setMatchedSkills(parseSkills(mr.getMatchedSkills()));
            dto.setMissingSkills(parseSkills(mr.getMissingSkills()));
        }

        return dto;
    }

    private List<String> parseSkills(String skillsString) {
        if (skillsString == null || skillsString.isBlank()) {
            return List.of();
        }
        return Arrays.stream(skillsString.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .collect(Collectors.toList());
    }
}
