package com.example.hirewave.scoreCV;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Enhanced ParsingResult for ATS Simulator
 * Includes strengths, weaknesses, verdict, levelLabel, and breakdown scores
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParsingResultV2 {
    /**
     * Overall score (0-100)
     */
    private int score;
    
    /**
     * Level label: "Xuất sắc" / "Tốt" / "Trung bình" / "Yếu"
     */
    private String levelLabel;
    
    /**
     * Verdict: "Đạt" / "Cần cải thiện" / "Không đạt"
     */
    private String verdict;
    
    /**
     * List of issues found (HIGH priority first)
     */
    private List<String> issues;
    
    /**
     * List of suggestions (prioritized: HIGH -> MEDIUM -> LOW)
     */
    private List<String> suggestions;
    
    /**
     * List of strengths (what CV does well)
     */
    private List<String> strengths;
    
    /**
     * List of weaknesses (what CV needs improvement)
     */
    private List<String> weaknesses;
    
    /**
     * Breakdown scores by criteria
     * Keys: "contact", "structure", "length", "header", "impact"
     * Values: scores (0-100) for each criterion
     */
    private Map<String, Integer> breakdown;
    
    /**
     * UI hints for frontend rendering
     */
    private Map<String, Object> uiHints;
    
    /**
     * Convert to legacy ParsingResult for backward compatibility
     */
    public ParsingResult toLegacyResult() {
        return new ParsingResult(score, issues, suggestions);
    }
}
