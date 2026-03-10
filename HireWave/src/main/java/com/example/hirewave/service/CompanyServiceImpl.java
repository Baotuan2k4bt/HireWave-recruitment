package com.example.hirewave.service;

import com.example.hirewave.dto.CompanyDTO;
import com.example.hirewave.entity.Company;
import com.example.hirewave.exception.HireWaveException;
import com.example.hirewave.repository.ICompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyServiceImpl implements CompanyService {

    @Autowired
    private ICompanyRepository companyRepository;

    @Override
    @Transactional
    public CompanyDTO createCompany(CompanyDTO companyDTO) throws HireWaveException {
        if (companyRepository.findByName(companyDTO.getName()).isPresent()) {
            throw new HireWaveException("COMPANY_ALREADY_EXISTS");
        }
        Company company = convertToEntity(companyDTO);
        Company savedCompany = companyRepository.save(company);
        return convertToDTO(savedCompany);
    }

    @Override
    @Transactional
    public CompanyDTO updateCompany(Long id, CompanyDTO companyDTO) throws HireWaveException {
        Company existingCompany = companyRepository.findById(id)
                .orElseThrow(() -> new HireWaveException("COMPANY_NOT_FOUND"));
        
        existingCompany.setName(companyDTO.getName());
        existingCompany.setLogoUrl(companyDTO.getLogoUrl());
        existingCompany.setWebsite(companyDTO.getWebsite());
        existingCompany.setLocation(companyDTO.getLocation());
        existingCompany.setIndustry(companyDTO.getIndustry());
        existingCompany.setCompanySize(companyDTO.getCompanySize());
        existingCompany.setDescription(companyDTO.getDescription());
        
        Company updatedCompany = companyRepository.save(existingCompany);
        return convertToDTO(updatedCompany);
    }

    @Override
    public CompanyDTO getCompany(Long id) throws HireWaveException {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new HireWaveException("COMPANY_NOT_FOUND"));
        return convertToDTO(company);
    }

    @Override
    public List<CompanyDTO> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CompanyDTO> getCompaniesByOwner(Long ownerId) {
        return companyRepository.findByOwnerId(ownerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private Company convertToEntity(CompanyDTO dto) {
        return Company.builder()
                .id(dto.getId())
                .name(dto.getName())
                .logoUrl(dto.getLogoUrl())
                .website(dto.getWebsite())
                .location(dto.getLocation())
                .industry(dto.getIndustry())
                .companySize(dto.getCompanySize())
                .description(dto.getDescription())
                .ownerId(dto.getOwnerId())
                .build();
    }

    private CompanyDTO convertToDTO(Company entity) {
        return CompanyDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .logoUrl(entity.getLogoUrl())
                .website(entity.getWebsite())
                .location(entity.getLocation())
                .industry(entity.getIndustry())
                .companySize(entity.getCompanySize())
                .description(entity.getDescription())
                .ownerId(entity.getOwnerId())
                .build();
    }
}
