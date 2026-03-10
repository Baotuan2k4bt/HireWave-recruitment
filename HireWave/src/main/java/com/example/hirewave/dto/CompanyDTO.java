package com.example.hirewave.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyDTO {
    private Long id;

    @NotBlank(message = "Company name is required")
    @Size(max = 255, message = "Company name must be less than 255 characters")
    private String name;

    @Pattern(regexp = "^$|(https?://.*)", message = "Invalid URL format")
    private String logoUrl;

    @Pattern(regexp = "^$|(https?://.*)", message = "Invalid URL format")
    private String website;

    @Size(max = 255, message = "Location must be less than 255 characters")
    private String location;

    @Size(max = 255, message = "Industry must be less than 255 characters")
    private String industry;

    @Size(max = 255, message = "Company size must be less than 255 characters")
    private String companySize;

    @Size(max = 5000, message = "Description must be less than 5000 characters")
    private String description;

    private Long ownerId;
}
