package com.example.hirewave.dto.AIMatching;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MatchingPreviewDTO {
    double finalScore;
    double skillRatio;
    double expRatio;
    double titleSimilarity;
    double keywordDensity;
    String summary;
    List<String> matchedSkills;
    List<String> missingSkills;

}
