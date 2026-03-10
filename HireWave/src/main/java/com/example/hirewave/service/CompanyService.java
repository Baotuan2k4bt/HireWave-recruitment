package com.example.hirewave.service;

import com.example.hirewave.dto.CompanyDTO;
import com.example.hirewave.entity.Company;
import com.example.hirewave.exception.HireWaveException;
import java.util.List;

public interface CompanyService {
    CompanyDTO createCompany(CompanyDTO companyDTO) throws HireWaveException;
    CompanyDTO updateCompany(Long id, CompanyDTO companyDTO) throws HireWaveException;
    CompanyDTO getCompany(Long id) throws HireWaveException;
    List<CompanyDTO> getAllCompanies();
    List<CompanyDTO> getCompaniesByOwner(Long ownerId);
}
