package com.example.hirewave.api;

import com.example.hirewave.dto.CompanyDTO;
import com.example.hirewave.exception.HireWaveException;
import com.example.hirewave.service.CompanyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.example.hirewave.jwt.CustomUserDetails;

@RestController
@RequestMapping("/api/employer")
@CrossOrigin
@Validated
public class CompanyAPI {

    @Autowired
    private CompanyService companyService;

    // POST /api/employer/company - Tạo công ty mới
    @PostMapping("/company")
    public ResponseEntity<CompanyDTO> createCompany(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid CompanyDTO companyDTO) throws HireWaveException {

        // Set ownerId từ current user
        companyDTO.setOwnerId(userDetails.getId());
        CompanyDTO created = companyService.createCompany(companyDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // PUT /api/employer/company/{id} - Cập nhật công ty (chỉ owner)
    @PutMapping("/company/{id}")
    public ResponseEntity<CompanyDTO> updateCompany(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id,
            @RequestBody @Valid CompanyDTO companyDTO) throws HireWaveException {

        // Kiểm tra ownership
        CompanyDTO existing = companyService.getCompany(id);
        if (!existing.getOwnerId().equals(userDetails.getId())) {
            throw new HireWaveException("ACCESS_DENIED");
        }

        CompanyDTO updated = companyService.updateCompany(id, companyDTO);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    // GET /api/employer/company - Lấy công ty của current employer
    @GetMapping("/company")
    public ResponseEntity<CompanyDTO> getMyCompany(
            @AuthenticationPrincipal CustomUserDetails userDetails) throws HireWaveException {

        java.util.List<CompanyDTO> companies = companyService.getCompaniesByOwner(userDetails.getId());
        if (companies.isEmpty()) {
            throw new HireWaveException("COMPANY_NOT_FOUND");
        }
        // Giả định mỗi employer chỉ có 1 công ty, lấy cái đầu
        return new ResponseEntity<>(companies.get(0), HttpStatus.OK);
    }

    // GET /api/employer/company/{id} - Public view (có thể dùng chung với CompanyAPI nếu có)
    // Có thể không cần nếu dùng GET /api/companies/{id} từ CompanyAPI chung
}
