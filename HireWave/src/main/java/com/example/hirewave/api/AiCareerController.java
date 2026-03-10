package com.example.hirewave.api;

import com.example.hirewave.dto.CareerFitRequest;
import com.example.hirewave.dto.CareerFitResponse;
import com.example.hirewave.service.GeminiCareerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai")
public class AiCareerController {

    private final GeminiCareerService geminiCareerService;

    public AiCareerController(GeminiCareerService geminiCareerService) {
        this.geminiCareerService = geminiCareerService;
    }
    @PostMapping("/career-fit")
    public ResponseEntity<CareerFitResponse> careerFit(@RequestBody CareerFitRequest req) {
        return ResponseEntity.ok(geminiCareerService.careerFit(req));
    }
}