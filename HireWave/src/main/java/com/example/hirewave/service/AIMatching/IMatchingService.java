package com.example.hirewave.service.AIMatching;

import com.example.hirewave.dto.AIMatching.MatchingPreviewDTO;
import com.example.hirewave.entity.Applicant;
import com.example.hirewave.entity.Job;
import com.example.hirewave.exception.HireWaveException;


public interface IMatchingService {

    MatchingPreviewDTO previewMatchFromDefaultCv(Long jobId, Long userId)
            throws HireWaveException;

    MatchingPreviewDTO getCandidateMatchingScore(Long jobId, Long userId)
            throws HireWaveException;

    void calculateAndSaveMatching(Applicant applicant, Job job);
}