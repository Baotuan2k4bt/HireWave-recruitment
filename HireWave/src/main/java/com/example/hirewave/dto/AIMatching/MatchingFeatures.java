package com.example.hirewave.dto.AIMatching;

import lombok.*;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MatchingFeatures {

    private double skillRatio;
    private double skillCosine;
    private double expRatio;
    private double titleSimilarity;
    private double keywordDensity;

    private List<String> matchedSkills;
    private List<String> missingSkills;
}
