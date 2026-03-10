package com.example.hirewave.service.AIMatching;

import com.example.hirewave.dto.AIMatching.MatchingFeatures;

public interface MatchingScorer {
    double score(MatchingFeatures features);
}
