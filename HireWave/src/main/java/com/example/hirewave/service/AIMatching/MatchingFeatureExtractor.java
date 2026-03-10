package com.example.hirewave.service.AIMatching;

import com.example.hirewave.dto.AIMatching.MatchingFeatures;
import com.example.hirewave.entity.Applicant;
import com.example.hirewave.entity.Job;
import com.example.hirewave.entity.UserResume;

public interface MatchingFeatureExtractor {
    MatchingFeatures extract(Job job, UserResume resume);

    MatchingFeatures extractFromApplicant(Applicant applicant, Job job);
}
