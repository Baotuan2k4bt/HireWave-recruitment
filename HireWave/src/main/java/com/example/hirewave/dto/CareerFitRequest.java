package com.example.hirewave.dto;

import java.util.List;

public record CareerFitRequest(
        String level,                 // Student | Fresher | Junior | Switch
        String description,           // mô tả tự do
        List<String> skills,          // optional
        List<String> preferredIndustries, // optional (danh mục ngành)
        Integer socialLevel,          // 0-100
        Integer analyticalLevel,      // 0-100
        Integer creativityLevel,      // 0-100
        Integer stabilityPreference   // 0-100
) {}
