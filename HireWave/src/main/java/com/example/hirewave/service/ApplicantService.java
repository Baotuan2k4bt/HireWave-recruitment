package com.example.hirewave.service;

import com.example.hirewave.dto.ApplicantResponseDTO;
import com.example.hirewave.dto.ApplicantDetailDTO;
import com.example.hirewave.exception.HireWaveException;

import java.util.List;

public interface ApplicantService {

    /**
     * Lấy danh sách ứng viên (Lite version - không kèm file CV) cho một công việc
     */
    List<ApplicantResponseDTO> getApplicantsByJob(Long jobId) throws HireWaveException;

    /**
     * Lấy danh sách tất cả ứng viên (Lite version - không kèm file CV)
     */
    List<ApplicantResponseDTO> getAllApplicants() throws HireWaveException;

    /**
     * Lấy chi tiết một ứng viên (bao gồm file CV Base64)
     */
    ApplicantDetailDTO getApplicantDetail(Long id) throws HireWaveException;

    /**
     * Tải về CV của ứng viên (Dạng byte array)
     */
    byte[] getResume(Long id) throws HireWaveException;

    /**
     * Tải về CV đã trích xuất (Dạng byte array)
     */
    byte[] getExtractedResume(Long id) throws HireWaveException;
}
