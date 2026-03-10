package com.example.hirewave.api;

import com.example.hirewave.dto.ApplicantResponseDTO;
import com.example.hirewave.dto.ApplicantDetailDTO;
import com.example.hirewave.exception.HireWaveException;
import com.example.hirewave.service.ApplicantService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employer/applicants")
@CrossOrigin
public class ApplicantAPI {

    private final ApplicantService applicantService;

    public ApplicantAPI(ApplicantService applicantService) {
        this.applicantService = applicantService;
    }

    /**
     * Lấy danh sách tất cả ứng viên (Lite version) cho toàn hệ thống
     * GET /api/employer/applicants
     */
    @GetMapping
    public ResponseEntity<List<ApplicantResponseDTO>> getAllApplicants()
            throws HireWaveException {
        return new ResponseEntity<>(applicantService.getAllApplicants(), HttpStatus.OK);
    }

    /**
     * Lấy danh sách ứng viên (Lite version) cho một công việc cụ thể
     * GET /api/employer/applicants/job/{jobId}
     */
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicantResponseDTO>> getApplicantsByJob(@PathVariable Long jobId)
            throws HireWaveException {
        return new ResponseEntity<>(applicantService.getApplicantsByJob(jobId), HttpStatus.OK);
    }

    /**
     * Lấy chi tiết một ứng viên (bao gồm CV Base64)
     * GET /api/employer/applicants/{id}/detail
     */
    @GetMapping("/{id}/detail")
    public ResponseEntity<ApplicantDetailDTO> getApplicantDetail(@PathVariable Long id)
            throws HireWaveException {
        return new ResponseEntity<>(applicantService.getApplicantDetail(id), HttpStatus.OK);
    }

    /**
     * Tải về CV PDF trực tiếp
     * GET /api/employer/applicants/{id}/resume
     */
    @GetMapping("/{id}/resume")
    public ResponseEntity<byte[]> downloadResume(@PathVariable Long id) throws HireWaveException {
        byte[] resumeData = applicantService.getResume(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", "resume_" + id + ".pdf");

        return new ResponseEntity<>(resumeData, headers, HttpStatus.OK);
    }

    /**
     * Tải về CV PDF đã trích xuất trực tiếp
     * GET /api/employer/applicants/{id}/extracted-resume
     */
    @GetMapping("/{id}/extracted-resume")
    public ResponseEntity<byte[]> downloadExtractedResume(@PathVariable Long id) throws HireWaveException {
        byte[] resumeData = applicantService.getExtractedResume(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", "resume_extracted_" + id + ".pdf");

        return new ResponseEntity<>(resumeData, headers, HttpStatus.OK);
    }
}
