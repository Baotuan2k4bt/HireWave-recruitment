package com.example.hirewave.service.RecruiterAI;

import com.example.hirewave.dto.AIMatching.CandidateCompareDTO;
import com.example.hirewave.dto.AIMatching.EmployerCandidateRankingDTO;
import com.example.hirewave.dto.AIMatching.MatchingFeatures;
import com.example.hirewave.entity.Applicant;
import com.example.hirewave.entity.Job;
import com.example.hirewave.entity.MatchingResult;
import com.example.hirewave.entity.Profile;
import com.example.hirewave.exception.HireWaveException;
import com.example.hirewave.repository.IJobRepository;
import com.example.hirewave.repository.IMatchingResultRepository;
import com.example.hirewave.repository.IProfileRepository;
import com.example.hirewave.service.AIMatching.MatchingFeatureExtractor;
import com.example.hirewave.utility.SkillNormalizer;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class RecruiterAIServiceImpl implements RecruiterAIService {
    private static final double DEFAULT_SKILL_WEIGHT = 0.7;
    private static final double DEFAULT_EXPERIENCE_WEIGHT = 0.3;
    private static final double EPSILON = 1e-6;

    private final IMatchingResultRepository matchingResultRepository;
    private final IJobRepository jobRepository;
    private final MatchingFeatureExtractor featureExtractor;
    private final IProfileRepository profileRepository;

    public RecruiterAIServiceImpl(
            IMatchingResultRepository matchingResultRepository,
            IJobRepository jobRepository,
            MatchingFeatureExtractor featureExtractor,
            IProfileRepository profileRepository
    ) {
        this.matchingResultRepository = matchingResultRepository;
        this.jobRepository = jobRepository;
        this.featureExtractor = featureExtractor;
        this.profileRepository = profileRepository;
    }

    @Override
    public List<EmployerCandidateRankingDTO> getRankingByJob(Long jobId)
            throws HireWaveException {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new HireWaveException("JOB_NOT_FOUND"));

        List<MatchingResult> results =
                matchingResultRepository.findByJobOrderByMatchingScoreDesc(job);

        return results.stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    public List<EmployerCandidateRankingDTO> getTopCandidates(Long jobId, int limit)
            throws HireWaveException {

        List<EmployerCandidateRankingDTO> ranking =
                getRankingByJob(jobId);

        return ranking.stream()
                .limit(limit)
                .toList();
    }

    @Override
    public CandidateCompareDTO compareCandidates(
            Long leftApplicationId,
            Long rightApplicationId
    ) throws HireWaveException {
        return compareCandidates(leftApplicationId, rightApplicationId, null);
    }

    public CandidateCompareDTO compareCandidates(
            Long leftApplicationId,
            Long rightApplicationId,
            Map<String, Double> weights
    ) throws HireWaveException {

        // Nếu recruiter lỡ chọn cùng một hồ sơ ở cả 2 bên, trả về thông điệp rõ ràng
        if (leftApplicationId != null && leftApplicationId.equals(rightApplicationId)) {
            MatchingResult match =
                    matchingResultRepository.findByApplicationId(leftApplicationId)
                            .orElseThrow(() -> new HireWaveException("CANDIDATE_NOT_FOUND"));

            EmployerCandidateRankingDTO dto = toDTO(match);
            String analysis = String.format(
                    "Bạn đang so sánh cùng một hồ sơ ứng viên (%s) cho vị trí %s.\n" +
                            "AI không thực hiện so sánh đối đầu trong trường hợp này. " +
                            "Vui lòng chọn 2 ứng viên khác nhau để xem phân tích chi tiết.",
                    dto.getApplicantName(),
                    match.getJob().getJobTitle()
            );

            return new CandidateCompareDTO(
                    dto,
                    dto,
                    dto.getApplicantName(),
                    0.0,
                    analysis
            );
        }

        MatchingResult leftMatch =
                matchingResultRepository.findByApplicationId(leftApplicationId)
                        .orElseThrow(() -> new HireWaveException("LEFT_CANDIDATE_NOT_FOUND"));

        MatchingResult rightMatch =
                matchingResultRepository.findByApplicationId(rightApplicationId)
                        .orElseThrow(() -> new HireWaveException("RIGHT_CANDIDATE_NOT_FOUND"));

        Job job = leftMatch.getJob();
        MatchingFeatures leftF = featureExtractor.extractFromApplicant(leftMatch.getApplication(), job);
        MatchingFeatures rightF = featureExtractor.extractFromApplicant(rightMatch.getApplication(), job);

        EmployerCandidateRankingDTO leftDTO = toDTO(leftMatch);
        EmployerCandidateRankingDTO rightDTO = toDTO(rightMatch);

        Map<String, Double> effectiveWeights = weights != null && !weights.isEmpty()
                ? weights
                : defaultWeights();

        // Logic AI Comparison with dynamic weights (skill vs experience)
        double leftScore = calculateCompositeScore(leftF, effectiveWeights);
        double rightScore = calculateCompositeScore(rightF, effectiveWeights);

        StringBuilder analysis = new StringBuilder();
        String winner;

        if (leftScore > rightScore) {
            winner = leftDTO.getApplicantName();
        } else if (rightScore > leftScore) {
            winner = rightDTO.getApplicantName();
        } else {
            winner = "Equal";
        }

        // Deep Analysis
        analysis.append(String.format("So sánh giữa %s và %s cho vị trí %s: \n",
                leftDTO.getApplicantName(), rightDTO.getApplicantName(), job.getJobTitle()));

        if (winner.equals("Equal")) {
            analysis.append("Hai ứng viên có năng lực tương đương. ");
        } else {
            analysis.append(String.format("Ứng viên %s đang có lợi thế hơn với điểm số %s/%s. ",
                    winner, Math.max(leftScore, rightScore), Math.min(leftScore, rightScore)));
        }

        // Nếu điểm tổng thể ngang nhau, cố gắng giải hòa dựa trên kinh nghiệm và kỹ năng
        if ("Equal".equals(winner)) {
            String tieBreakSuggestion = buildTieBreakSuggestion(leftF, rightF, leftDTO, rightDTO);
            if (!tieBreakSuggestion.isBlank()) {
                analysis.append(" ").append(tieBreakSuggestion);
            }
        }

        // Market / experience insight (ưu tiên dữ liệu thực tế từ profile)
        appendMarketExperienceInsight(job, leftMatch.getApplication(), rightMatch.getApplication(), leftF, rightF, leftDTO, rightDTO, analysis);

        // Dự đoán xác suất thành công (simple heuristic)
        double leftSuccessProb = predictSuccessProbability(leftMatch, leftF);
        double rightSuccessProb = predictSuccessProbability(rightMatch, rightF);
        analysis.append(String.format(
                "\nXác suất thành công ước tính (dựa trên độ phù hợp hồ sơ và kinh nghiệm): %s%% cho %s, %s%% cho %s.",
                toPercent(leftSuccessProb), leftDTO.getApplicantName(),
                toPercent(rightSuccessProb), rightDTO.getApplicantName()
        ));

        // Cảnh báo thiên kiến (bias) đơn giản
        appendBiasHint(leftMatch.getApplication(), rightMatch.getApplication(), analysis);

        // Skill analysis
        List<String> leftOnlySkills = leftF.getMatchedSkills().stream()
                .filter(s -> !rightF.getMatchedSkills().contains(s))
                .collect(Collectors.toList());
        List<String> rightOnlySkills = rightF.getMatchedSkills().stream()
                .filter(s -> !leftF.getMatchedSkills().contains(s))
                .collect(Collectors.toList());

        if (!leftOnlySkills.isEmpty()) {
            analysis.append(String.format("\n- %s sở hữu các kỹ năng độc nhất: %s. ",
                    leftDTO.getApplicantName(), String.join(", ", leftOnlySkills)));
        }
        if (!rightOnlySkills.isEmpty()) {
            analysis.append(String.format("\n- %s sở hữu các kỹ năng độc nhất: %s. ",
                    rightDTO.getApplicantName(), String.join(", ", rightOnlySkills)));
        }

        // Experience vs Skill balance
        if (leftF.getExpRatio() > rightF.getExpRatio() && leftF.getSkillRatio() < rightF.getSkillRatio()) {
            analysis.append(String.format("\nLựa chọn %s nếu bạn cần kinh nghiệm thực chiến dày dặn, hoặc %s nếu bạn ưu tiên sự đa dạng về kỹ năng công nghệ.",
                    leftDTO.getApplicantName(), rightDTO.getApplicantName()));
        } else if (rightF.getExpRatio() > leftF.getExpRatio() && rightF.getSkillRatio() < leftF.getSkillRatio()) {
            analysis.append(String.format("\nLựa chọn %s nếu bạn cần kinh nghiệm thực chiến dày dặn, hoặc %s nếu bạn ưu tiên sự đa dạng về kỹ năng công nghệ.",
                    rightDTO.getApplicantName(), leftDTO.getApplicantName()));
        }

        return new CandidateCompareDTO(
                leftDTO,
                rightDTO,
                winner,
                Math.abs(leftScore - rightScore),
                analysis.toString()
        );
    }

    private EmployerCandidateRankingDTO toDTO(MatchingResult mr) {

        Applicant applicant = mr.getApplication();

        return new EmployerCandidateRankingDTO(
                applicant.getId(),
                applicant.getApplicantId(),
                applicant.getName(),
                applicant.getEmail(),
                "Candidate",
                mr.getMatchingScore(),
                split(mr.getMatchedSkills()),
                split(mr.getMissingSkills()),
                mr.getSummary()
        );
    }

    private List<String> split(String value) {
        if (value == null || value.isBlank()) {
            return List.of();
        }
        // Hỗ trợ cả "," và ";" (delimiter linh hoạt) và chuẩn hóa kỹ năng
        List<String> rawSkills = Arrays.stream(value.split("[,;]"))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .toList();

        return SkillNormalizer.normalizeList(rawSkills);
    }

    private Map<String, Double> defaultWeights() {
        return Map.of(
                "skill", DEFAULT_SKILL_WEIGHT,
                "experience", DEFAULT_EXPERIENCE_WEIGHT
        );
    }

    private double calculateCompositeScore(MatchingFeatures features, Map<String, Double> weights) {
        if (features == null) {
            return 0.0;
        }

        double skillWeight = weights != null && weights.get("skill") != null
                ? weights.get("skill")
                : DEFAULT_SKILL_WEIGHT;
        double expWeight = weights != null && weights.get("experience") != null
                ? weights.get("experience")
                : DEFAULT_EXPERIENCE_WEIGHT;

        double sum = skillWeight + expWeight;
        if (sum <= 0) {
            skillWeight = DEFAULT_SKILL_WEIGHT;
            expWeight = DEFAULT_EXPERIENCE_WEIGHT;
            sum = skillWeight + expWeight;
        }

        skillWeight /= sum;
        expWeight /= sum;

        return features.getSkillRatio() * skillWeight + features.getExpRatio() * expWeight;
    }

    private void appendMarketExperienceInsight(
            Job job,
            Applicant leftApplicant,
            Applicant rightApplicant,
            MatchingFeatures leftF,
            MatchingFeatures rightF,
            EmployerCandidateRankingDTO leftDTO,
            EmployerCandidateRankingDTO rightDTO,
            StringBuilder analysis
    ) {
        String title = job.getJobTitle() != null ? job.getJobTitle().toLowerCase() : "";
        double avgYears;

        if (title.contains("senior") || title.contains("trưởng nhóm") || title.contains("lead")) {
            avgYears = 5.0;
        } else if (title.contains("junior") || title.contains("intern") || title.contains("fresher")
                || title.contains("thực tập")) {
            avgYears = 0.5; // thực tập / fresher: kinh nghiệm tham chiếu thấp hơn
        } else {
            avgYears = 3.0;
        }

        int leftYears = resolveCandidateYears(leftApplicant, leftF);
        int rightYears = resolveCandidateYears(rightApplicant, rightF);

        if (leftYears <= 0 && rightYears <= 0) {
            analysis.append("\nHệ thống chưa có đủ dữ liệu tin cậy về số năm kinh nghiệm thực tế của hai ứng viên (profile chưa cập nhật rõ ràng). Vui lòng tham khảo thêm hồ sơ chi tiết và kết quả phỏng vấn.");
            return;
        }

        double leftDelta = avgYears > 0 ? (leftYears - avgYears) / avgYears * 100.0 : 0.0;
        double rightDelta = avgYears > 0 ? (rightYears - avgYears) / avgYears * 100.0 : 0.0;

        analysis.append(String.format(
                "\nTheo mức kinh nghiệm tham chiếu cho vị trí này (≈ %.1f năm): %s có khoảng %d năm (%.1f%% so với trung bình), %s có khoảng %d năm (%.1f%% so với trung bình).",
                avgYears,
                leftDTO.getApplicantName(), leftYears, leftDelta,
                rightDTO.getApplicantName(), rightYears, rightDelta
        ));
    }

    private int resolveCandidateYears(Applicant applicant, MatchingFeatures features) {
        if (applicant != null && applicant.getProfileId() != null) {
            try {
                Profile profile = profileRepository.findById(applicant.getProfileId()).orElse(null);
                if (profile != null && profile.getTotalExp() != null) {
                    return profile.getTotalExp().intValue();
                }
            } catch (Exception ignored) {
                // Nếu có lỗi khi đọc profile, sẽ fallback xuống heuristic bên dưới
            }
        }

        // Fallback nhẹ dựa trên expRatio khi không có profile/totalExp rõ ràng
        if (features != null) {
            double ratio = clamp01(features.getExpRatio());
            // Map 0..1 -> 0..5 năm (giữ bảo thủ để tránh thổi phồng kinh nghiệm)
            return (int) Math.round(ratio * 5.0);
        }

        return 0;
    }

    private double predictSuccessProbability(MatchingResult mr, MatchingFeatures features) {
        if (mr == null || features == null) {
            return 0.0;
        }
        // Giả định matchingScore đã được chuẩn hóa về [0,1] hoặc gần như vậy
        double base = mr.getMatchingScore() != null ? mr.getMatchingScore() : 0.0;
        if (base > 1.0) {
            base = base / 100.0;
        }
        base = clamp01(base);

        double skillComponent = clamp01(features.getSkillRatio());
        double expComponent = clamp01(features.getExpRatio());

        double prob = 0.5 * base + 0.3 * skillComponent + 0.2 * expComponent;
        return clamp01(prob);
    }

    private double clamp01(double v) {
        if (v < 0.0) return 0.0;
        if (v > 1.0) return 1.0;
        return v;
    }

    private String toPercent(double v) {
        return String.format("%.0f", v * 100.0);
    }

    private void appendBiasHint(Applicant left, Applicant right, StringBuilder analysis) {
        if (left == null || right == null) {
            return;
        }

        // Nếu thực chất là cùng một hồ sơ ứng viên thì không cần cảnh báo đa dạng
        if (left.getId() != null && left.getId().equals(right.getId())) {
            return;
        }

        String leftName = left.getName() != null ? left.getName().toLowerCase() : "";
        String rightName = right.getName() != null ? right.getName().toLowerCase() : "";

        // Heuristic rất đơn giản dựa trên tên, chỉ dùng để nhắc nhở cân nhắc đa dạng
        boolean possibleSameGroup =
                (isLikelyMale(leftName) && isLikelyMale(rightName)) ||
                        (isLikelyFemale(leftName) && isLikelyFemale(rightName));

        if (possibleSameGroup) {
            analysis.append("\n[Chú ý] Cả hai ứng viên có hồ sơ khá tương đồng về mặt nhân khẩu học (ước lượng từ tên). Hãy cân nhắc thêm yếu tố đa dạng (giới tính, nền tảng, xuất thân) khi mở rộng tìm kiếm ứng viên.");
        }
    }

    private boolean isLikelyMale(String name) {
        if (name == null) return false;
        return name.contains("anh") || name.contains("minh") || name.contains("quang")
                || name.contains("hoàng") || name.contains("thắng") || name.contains("đạt");
    }

    private boolean isLikelyFemale(String name) {
        if (name == null) return false;
        return name.contains("anh thư") || name.contains("linh") || name.contains("hoa")
                || name.contains("hương") || name.contains("trang") || name.contains("ngọc");
    }

    private String buildTieBreakSuggestion(
            MatchingFeatures leftF,
            MatchingFeatures rightF,
            EmployerCandidateRankingDTO leftDTO,
            EmployerCandidateRankingDTO rightDTO
    ) {
        double leftExp = leftF.getExpRatio();
        double rightExp = rightF.getExpRatio();
        double leftSkill = leftF.getSkillRatio();
        double rightSkill = rightF.getSkillRatio();

        boolean expDiff = Math.abs(leftExp - rightExp) > EPSILON;
        boolean skillDiff = Math.abs(leftSkill - rightSkill) > EPSILON;

        StringBuilder sb = new StringBuilder();
        if (leftExp > rightExp && leftSkill >= rightSkill) {
            sb.append(String.format("Nếu bạn cần một ứng viên có thể bắt tay vào dự án ngay với kinh nghiệm thực chiến dày dặn, nên ưu tiên %s.", leftDTO.getApplicantName()));
        } else if (rightExp > leftExp && rightSkill >= leftSkill) {
            sb.append(String.format("Nếu bạn cần một ứng viên có thể bắt tay vào dự án ngay với kinh nghiệm thực chiến dày dặn, nên ưu tiên %s.", rightDTO.getApplicantName()));
        } else if (leftSkill > rightSkill && leftExp >= rightExp) {
            sb.append(String.format("Nếu bạn ưu tiên sự đa dạng và chiều sâu về kỹ năng cho stack công nghệ hiện tại, nên ưu tiên %s.", leftDTO.getApplicantName()));
        } else if (rightSkill > leftSkill && rightExp >= leftExp) {
            sb.append(String.format("Nếu bạn ưu tiên sự đa dạng và chiều sâu về kỹ năng cho stack công nghệ hiện tại, nên ưu tiên %s.", rightDTO.getApplicantName()));
        } else {
            sb.append("Hai ứng viên có điểm mạnh khác nhau về kinh nghiệm và kỹ năng, hãy cân nhắc thêm các yếu tố như văn hóa đội ngũ, khả năng thích nghi và đánh giá phỏng vấn.");
        }

        return sb.toString();
    }
}
