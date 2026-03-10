package com.example.hirewave.service.AIMatching;

import com.example.hirewave.AISummaryGenerator;
import com.example.hirewave.dto.AIMatching.MatchingFeatures;
import com.example.hirewave.dto.AIMatching.MatchingPreviewDTO;
import com.example.hirewave.entity.Applicant;
import com.example.hirewave.entity.Job;
import com.example.hirewave.entity.MatchingResult;
import com.example.hirewave.entity.UserResume;
import com.example.hirewave.exception.HireWaveException;
import com.example.hirewave.repository.IJobRepository;
import com.example.hirewave.repository.IMatchingResultRepository;
import com.example.hirewave.repository.UserResumeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
public class MatchingService implements IMatchingService {

    private static final Logger logger = LoggerFactory.getLogger(MatchingService.class);

    private final MatchingFeatureExtractor extractor;
    private final MatchingScorer scorer;
    private final AISummaryGenerator summaryGenerator;
    private final UserResumeRepository userResumeRepository;
    private final IJobRepository jobRepository;
    private final IMatchingResultRepository matchingResultRepository;


    public MatchingService(
            MatchingFeatureExtractor extractor,
            MatchingScorer scorer,
            AISummaryGenerator summaryGenerator,
            UserResumeRepository userResumeRepository,
            IJobRepository jobRepository, IMatchingResultRepository matchingResultRepository) {

        this.extractor = extractor;
        this.scorer = scorer;
        this.summaryGenerator = summaryGenerator;
        this.userResumeRepository = userResumeRepository;
        this.jobRepository = jobRepository;
        this.matchingResultRepository = matchingResultRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public MatchingPreviewDTO previewMatchFromDefaultCv(Long jobId, Long userId)
            throws HireWaveException {

        // 1️⃣ Get Job
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new HireWaveException("JOB_NOT_FOUND"));

        // 2️⃣ Get Default CV
        UserResume resume = userResumeRepository
                .findByUserIdAndIsDefaultTrue(userId)
                .orElseThrow(() -> new HireWaveException("DEFAULT_CV_NOT_FOUND"));

        // 3️⃣ Extract Features
        MatchingFeatures features = extractor.extract(job, resume);

        // 4️⃣ Linear Model Scoring
        double finalScore = clampScore(scorer.score(features));

        // 5️⃣ AI Summary
        String summary = summaryGenerator.generate(
                finalScore,
                features,
                job.getJobTitle()
        );

        // 6️⃣ Return DTO
        return new MatchingPreviewDTO(
                finalScore,
                features.getSkillRatio(),
                features.getExpRatio(),
                features.getTitleSimilarity(),
                features.getKeywordDensity(),
                summary,
                features.getMatchedSkills(),
                features.getMissingSkills()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public MatchingPreviewDTO getCandidateMatchingScore(Long jobId, Long userId) throws HireWaveException {
        // 1️⃣ Find the applicant record for this user + job
        Applicant applicant = jobRepository.findApplicantByJobAndApplicantId(jobId, userId)
                .orElseThrow(() -> new HireWaveException("APPLICANT_NOT_FOUND"));

        // 2️⃣ Find existing matching result
        return matchingResultRepository.findByApplicationId(applicant.getId())
                .map(result -> new MatchingPreviewDTO(
                        result.getMatchingScore(),
                        // For persisted results, we need to reconstruct features ratios or store them separately
                        // For now, use 0.5 as placeholder or extract from stored data if available
                        0.0, // skillRatio - not stored, would need to be added to entity
                        0.0, // expRatio - not stored
                        0.0, // titleSimilarity - not stored
                        0.0, // keywordDensity - not stored
                        result.getSummary(),
                        parseCsvToList(result.getMatchedSkills()),
                        parseCsvToList(result.getMissingSkills())
                ))
                .orElseThrow(() -> new HireWaveException("MATCHING_RESULT_NOT_FOUND"));
    }

    private List<String> parseCsvToList(String csv) {
        if (csv == null || csv.isBlank()) return List.of();
        return Arrays.stream(csv.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .toList();
    }

    @Override
    @Transactional
    public void calculateAndSaveMatching(Applicant applicant, Job job) {
        if (applicant == null || job == null) {
            logger.warn("calculateAndSaveMatching: applicant or job is null");
            return;
        }
        if (applicant.getId() == null) {
            logger.error("calculateAndSaveMatching: applicant.id is NULL! applicant.applicantId={}, job.id={}",
                    applicant.getApplicantId(), job.getId());
            return; // must be persisted to create 1-1 result
        }

        // Nếu đã có result thì không tạo lại
        if (matchingResultRepository.existsByApplicationId(applicant.getId())) {
            logger.info("calculateAndSaveMatching: already exists for applicantId={}, jobId={}", applicant.getId(), job.getId());
            return;
        }

        // Defensive checks
        if (job.getSkillsRequired() == null || job.getSkillsRequired().isEmpty()) {
            logger.warn("calculateAndSaveMatching: job {} has no skillsRequired, matching may be inaccurate", job.getId());
        }

        // Check applicant data availability
        boolean hasSkills = applicant.getSkills() != null && !applicant.getSkills().isBlank();
        boolean hasExtractedText = applicant.getExtractedText() != null && !applicant.getExtractedText().isBlank();
        boolean hasResume = applicant.getResume() != null && applicant.getResume().length > 0;

        if (!hasSkills && !hasExtractedText && !hasResume) {
            logger.warn("calculateAndSaveMatching: applicant {} has no skills, extractedText, or resume - cannot calculate matching",
                    applicant.getId());
            // Still try to save a minimal result with 0 score so UI knows it was attempted
            saveMinimalResult(applicant, job, "No candidate data available for matching");
            return;
        }

        try {
            logger.info("calculateAndSaveMatching: extracting features for applicantId={}, jobId={}", applicant.getId(), job.getId());
            // 1️⃣ Extract features
            MatchingFeatures features = extractor.extractFromApplicant(applicant, job);
            logger.info("calculateAndSaveMatching: features extracted - skillRatio={}, expRatio={}, titleSim={}",
                    features.getSkillRatio(), features.getExpRatio(), features.getTitleSimilarity());

            // 2️⃣ Score (linear model)
            double finalScore = clampScore(scorer.score(features));
            logger.info("calculateAndSaveMatching: final score = {}", finalScore);

            // 3️⃣ Tính matched/missing skills
            List<String> matched = features.getMatchedSkills() != null ? features.getMatchedSkills() : List.of();
            List<String> missing = features.getMissingSkills() != null ? features.getMissingSkills() : List.of();
            logger.info("calculateAndSaveMatching: matchedSkills count={}, missingSkills count={}", matched.size(), missing.size());

            // 4️⃣ Generate AI summary
            String summary = summaryGenerator.generate(
                    finalScore,
                    features,
                    job.getJobTitle()
            );
            logger.info("calculateAndSaveMatching: summary generated (length={})", summary.length());

            // 5️⃣ Build entity
            MatchingResult result = MatchingResult.builder()
                    .application(applicant)
                    .job(job)
                    .matchingScore(finalScore)
                    .matchedSkills(String.join(", ", matched))
                    .missingSkills(String.join(", ", missing))
                    .summary(summary)
                    .build();

            logger.info("calculateAndSaveMatching: saving MatchingResult to DB...");
            MatchingResult savedResult = matchingResultRepository.save(result);
            matchingResultRepository.flush(); // Force insert immediately
            logger.info("calculateAndSaveMatching: SUCCESS - saved result for applicantId={}, jobId={}, score={}, resultId={}",
                    applicant.getId(), job.getId(), finalScore, savedResult.getId());

        } catch (Exception e) {
            logger.error("calculateAndSaveMatching: FAILED for applicantId={}, jobId={}", applicant.getId(), job.getId(), e);
            // Save minimal result to mark attempt
            saveMinimalResult(applicant, job, e.getMessage());
        }
    }

    private void saveMinimalResult(Applicant applicant, Job job, String errorMessage) {
        try {
            MatchingResult result = MatchingResult.builder()
                    .application(applicant)
                    .job(job)
                    .matchingScore(0.0)
                    .matchedSkills("")
                    .missingSkills("")
                    .summary("AI matching unavailable: " + errorMessage)
                    .build();
            matchingResultRepository.save(result);
        } catch (Exception ex) {
            logger.error("Failed to save minimal matching result", ex);
        }
    }

    private double clampScore(double score) {
        if (Double.isNaN(score) || Double.isInfinite(score)) return 0.0;
        return Math.max(0.0, Math.min(100.0, score));
    }
}