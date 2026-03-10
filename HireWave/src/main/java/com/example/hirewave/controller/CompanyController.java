package com.example.hirewave.controller;

import com.example.hirewave.dto.CompanyDTO;
import com.example.hirewave.exception.HireWaveException;
import com.example.hirewave.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @PostMapping
    public ResponseEntity<CompanyDTO> createCompany(@RequestBody CompanyDTO companyDTO) throws HireWaveException {
        return new ResponseEntity<>(companyService.createCompany(companyDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CompanyDTO> updateCompany(@PathVariable Long id, @RequestBody CompanyDTO companyDTO) throws HireWaveException {
        return ResponseEntity.ok(companyService.updateCompany(id, companyDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyDTO> getCompany(@PathVariable Long id) throws HireWaveException {
        return ResponseEntity.ok(companyService.getCompany(id));
    }

    @GetMapping
    public ResponseEntity<List<CompanyDTO>> getAllCompanies() {
        return ResponseEntity.ok(companyService.getAllCompanies());
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<CompanyDTO>> getCompaniesByOwner(@PathVariable Long ownerId) {
        return ResponseEntity.ok(companyService.getCompaniesByOwner(ownerId));
    }
}
