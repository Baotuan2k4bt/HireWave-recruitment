package com.example.hirewave.service.scoreCVService;

import com.example.hirewave.scoreCV.ParsingResult;

public interface IParsingScorerService {
    ParsingResult score(String extractedText);

}
