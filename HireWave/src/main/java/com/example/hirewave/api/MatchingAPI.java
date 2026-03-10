package com.example.hirewave.api;

import com.example.hirewave.dto.AIMatching.MatchingPreviewDTO;
import com.example.hirewave.exception.HireWaveException;
import com.example.hirewave.jwt.CustomUserDetails;
import com.example.hirewave.service.AIMatching.IMatchingService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/candidate-ai/matching")
public class MatchingAPI {
    private final IMatchingService matchingService;

    public MatchingAPI(IMatchingService matchingService) {
        this.matchingService = matchingService;
    }

    /**
     * Preview AI matching score trước khi apply (dùng Default CV).
     * GET /api/candidate-ai/matching/preview/{jobId}
     */
    @GetMapping("/preview/{jobId}")
    public MatchingPreviewDTO previewMatching(
            @PathVariable Long jobId,
            @AuthenticationPrincipal CustomUserDetails currentUser
    )
            throws HireWaveException {

        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        return matchingService.previewMatchFromDefaultCv(jobId, currentUser.getId());
    }

    /**
     * Xem matching score đã lưu sau khi apply.
     * GET /api/candidate-ai/matching/my-score/{jobId}
     */
    @GetMapping("/my-score/{jobId}")
    public MatchingPreviewDTO getMyMatchingScore(
            @PathVariable Long jobId,
            @AuthenticationPrincipal CustomUserDetails currentUser
    )
            throws HireWaveException {

        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        return matchingService.getCandidateMatchingScore(jobId, currentUser.getId());
    }
}
