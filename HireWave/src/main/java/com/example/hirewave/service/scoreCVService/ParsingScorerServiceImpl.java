package com.example.hirewave.service.scoreCVService;

import com.example.hirewave.scoreCV.ParsingResult;
import com.example.hirewave.scoreCV.ParsingResultV2;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * ATS Simulator - Rule-based CV Evaluation Service
 * 
 * This service evaluates CVs using rule-based logic to simulate how
 * Applicant Tracking Systems (ATS) read and score resumes.
 * 
 * Key principles:
 * - No ML/AI models, pure rule-based
 * - Multi-language support (Vietnamese/English)
 * - Realistic scoring (60-95 range, not easy 100s)
 * - Prioritized suggestions (HIGH -> MEDIUM -> LOW)
 * - Fresher-friendly evaluation
 */
@Service
public class ParsingScorerServiceImpl implements IParsingScorerService {

    // Compiled patterns for performance
    private static final Pattern EMAIL_PATTERN = Pattern.compile(ATSVocabulary.EMAIL_PATTERN);
    private static final Pattern PHONE_PATTERN = Pattern.compile(ATSVocabulary.PHONE_PATTERN);
    private static final Pattern SECTION_HEADING_PATTERN = Pattern.compile(
        ATSVocabulary.SECTION_HEADING_PATTERN, Pattern.MULTILINE | Pattern.CASE_INSENSITIVE
    );
    private static final Pattern PERCENTAGE_PATTERN = Pattern.compile(ATSVocabulary.PERCENTAGE_PATTERN);
    private static final Pattern NUMBER_PATTERN = Pattern.compile(ATSVocabulary.NUMBER_PATTERN);

    @Override
    public ParsingResult score(String extractedText) {
        ParsingResultV2 resultV2 = scoreV2(extractedText);
        return resultV2.toLegacyResult();
    }

    /**
     * Enhanced scoring with V2 result structure
     */
    public ParsingResultV2 scoreV2(String extractedText) {
        // Initialize result
        ParsingResultV2 result = new ParsingResultV2();
        result.setBreakdown(new HashMap<>());
        result.setUiHints(new HashMap<>());
        result.setIssues(new ArrayList<>());
        result.setSuggestions(new ArrayList<>());
        result.setStrengths(new ArrayList<>());
        result.setWeaknesses(new ArrayList<>());

        // Handle empty/null text
        if (extractedText == null || extractedText.isBlank()) {
            result.setScore(0);
            result.setLevelLabel("Yếu");
            result.setVerdict("Không đạt");
            result.getIssues().add("Không thể trích xuất nội dung CV (có thể CV là ảnh scan hoặc file không hỗ trợ).");
            result.getSuggestions().add("Hãy dùng CV dạng PDF text-based hoặc DOCX; tránh CV dạng ảnh/scan.");
            result.getWeaknesses().add("CV không thể đọc được bởi ATS");
            return result;
        }

        // Normalize text for analysis
        String normalizedText = ATSVocabulary.normalize(extractedText);
        String originalText = extractedText;
        int wordCount = originalText.trim().split("\\s+").length;

        // Initialize scores
        int contactScore = 0;
        int structureScore = 0;
        int lengthScore = 0;
        int headerScore = 0;
        int impactScore = 0;

        // ==================== A) CONTACT INFORMATION ====================
        boolean hasEmail = EMAIL_PATTERN.matcher(originalText).find();
        boolean hasPhone = PHONE_PATTERN.matcher(originalText).find();
        
        if (hasEmail && hasPhone) {
            contactScore = ATSVocabulary.WEIGHT_CONTACT;
            result.getStrengths().add("Có đầy đủ thông tin liên hệ (email và số điện thoại)");
        } else if (hasEmail) {
            contactScore = ATSVocabulary.WEIGHT_CONTACT / 2;
            result.getIssues().add("Thiếu số điện thoại");
            result.getWeaknesses().add("Thiếu thông tin liên hệ quan trọng");
            result.getSuggestions().add("HIGH: Thêm số điện thoại vào phần đầu CV");
        } else if (hasPhone) {
            contactScore = ATSVocabulary.WEIGHT_CONTACT / 2;
            result.getIssues().add("Thiếu email");
            result.getWeaknesses().add("Thiếu thông tin liên hệ quan trọng");
            result.getSuggestions().add("HIGH: Thêm email vào phần đầu CV");
        } else {
            contactScore = 0;
            result.getIssues().add("Thiếu cả email và số điện thoại");
            result.getWeaknesses().add("Thiếu hoàn toàn thông tin liên hệ");
            result.getSuggestions().add("HIGH: Thêm email và số điện thoại vào phần đầu CV (bắt buộc)");
        }

        // ==================== B) CV STRUCTURE (SECTIONS) ====================
        Map<String, Boolean> sections = detectSections(originalText, normalizedText);
        int sectionCount = (int) sections.values().stream().filter(Boolean::booleanValue).count();
        
        if (sectionCount >= 4) {
            structureScore = ATSVocabulary.WEIGHT_STRUCTURE;
            result.getStrengths().add("CV có cấu trúc đầy đủ với tất cả các section quan trọng");
        } else if (sectionCount >= 3) {
            structureScore = (int) (ATSVocabulary.WEIGHT_STRUCTURE * 0.8);
            result.getStrengths().add("CV có cấu trúc tốt với hầu hết các section cần thiết");
        } else if (sectionCount >= 2) {
            structureScore = (int) (ATSVocabulary.WEIGHT_STRUCTURE * 0.5);
            result.getIssues().add("CV thiếu một số section quan trọng");
            result.getWeaknesses().add("Cấu trúc CV chưa đầy đủ");
            result.getSuggestions().add("MEDIUM: Thêm các section còn thiếu (Skills, Education, Experience, Projects)");
        } else {
            structureScore = (int) (ATSVocabulary.WEIGHT_STRUCTURE * 0.2);
            result.getIssues().add("CV thiếu nhiều section quan trọng");
            result.getWeaknesses().add("Cấu trúc CV không đạt chuẩn ATS");
            result.getSuggestions().add("HIGH: Thêm tiêu đề section rõ ràng (Skills, Education, Experience, Projects)");
        }

        // Fresher-friendly check
        boolean hasExperience = sections.get("experience");
        boolean hasProjects = sections.get("projects");
        if (!hasExperience && hasProjects) {
            result.getStrengths().add("Có dự án/đồ án để bù đắp cho thiếu kinh nghiệm làm việc");
            result.getSuggestions().add("LOW: Nhấn mạnh vai trò, tech stack và kết quả trong các dự án");
        } else if (!hasExperience && !hasProjects) {
            structureScore = Math.max(0, structureScore - 5);
            result.getIssues().add("Thiếu cả kinh nghiệm và dự án");
            result.getWeaknesses().add("Không có bằng chứng về năng lực thực tế");
            result.getSuggestions().add("HIGH: Thêm ít nhất Projects/Capstone để thể hiện kỹ năng");
        }

        // ==================== C) CONTENT LENGTH ====================
        if (wordCount < ATSVocabulary.MIN_WORDS) {
            lengthScore = 0;
            result.getIssues().add("Nội dung CV quá ngắn (< 100 từ), khó đánh giá");
            result.getWeaknesses().add("CV quá ngắn, thiếu thông tin chi tiết");
            result.getSuggestions().add("HIGH: Bổ sung Projects/Experience và mô tả rõ công nghệ + kết quả");
        } else if (wordCount < ATSVocabulary.OPTIMAL_MIN_WORDS) {
            lengthScore = (int) (ATSVocabulary.WEIGHT_LENGTH * 0.5);
            result.getIssues().add("Nội dung CV hơi ngắn (100-150 từ)");
            result.getWeaknesses().add("CV cần thêm chi tiết");
            result.getSuggestions().add("MEDIUM: Bổ sung thêm chi tiết về kinh nghiệm và dự án");
        } else if (wordCount >= ATSVocabulary.OPTIMAL_MIN_WORDS && wordCount <= ATSVocabulary.OPTIMAL_MAX_WORDS) {
            lengthScore = ATSVocabulary.WEIGHT_LENGTH;
            result.getStrengths().add("Độ dài CV phù hợp (150-800 từ)");
        } else if (wordCount > ATSVocabulary.OPTIMAL_MAX_WORDS && wordCount <= ATSVocabulary.MAX_WORDS) {
            lengthScore = (int) (ATSVocabulary.WEIGHT_LENGTH * 0.8);
            result.getIssues().add("CV hơi dài (> 800 từ), có thể làm nhà tuyển dụng mất tập trung");
            result.getSuggestions().add("LOW: Rút gọn CV, tập trung vào thông tin quan trọng nhất");
        } else {
            lengthScore = (int) (ATSVocabulary.WEIGHT_LENGTH * 0.6);
            result.getIssues().add("CV quá dài (> 900 từ)");
            result.getWeaknesses().add("CV quá dài, khó đọc");
            result.getSuggestions().add("MEDIUM: Rút gọn CV xuống 400-600 từ, loại bỏ thông tin không cần thiết");
        }

        // ==================== D) HEADER PLACEMENT ====================
        String headerText = originalText.substring(0, Math.min(ATSVocabulary.HEADER_CHECK_RANGE, originalText.length()));
        String headerNormalized = ATSVocabulary.normalize(headerText);
        
        boolean emailInHeader = EMAIL_PATTERN.matcher(headerText).find();
        boolean phoneInHeader = PHONE_PATTERN.matcher(headerText).find();
        
        if (emailInHeader && phoneInHeader) {
            headerScore = ATSVocabulary.WEIGHT_HEADER;
            result.getStrengths().add("Thông tin liên hệ được đặt ở phần đầu CV (ATS-friendly)");
        } else if (emailInHeader || phoneInHeader) {
            headerScore = ATSVocabulary.WEIGHT_HEADER / 2;
            if (!emailInHeader && hasEmail) {
                result.getSuggestions().add("LOW: Nên đặt email ở phần đầu CV (trong 300 ký tự đầu) để ATS dễ nhận diện");
            }
            if (!phoneInHeader && hasPhone) {
                result.getSuggestions().add("LOW: Nên đặt số điện thoại ở phần đầu CV để dễ liên hệ");
            }
        } else {
            headerScore = 0;
            if (hasEmail || hasPhone) {
                result.getSuggestions().add("MEDIUM: Di chuyển thông tin liên hệ lên phần đầu CV");
            }
        }

        // ==================== E) CONTENT IMPACT (Metrics & Action Verbs) ====================
        int actionVerbCount = ATSVocabulary.countOccurrences(originalText, ATSVocabulary.ALL_ACTION_VERBS);
        int metricCount = countMetrics(originalText);
        boolean hasPercentages = PERCENTAGE_PATTERN.matcher(originalText).find();
        
        if (actionVerbCount >= 5 && metricCount >= 3) {
            impactScore = ATSVocabulary.WEIGHT_IMPACT;
            result.getStrengths().add("CV có nhiều số liệu và action verbs, thể hiện kết quả cụ thể");
        } else if (actionVerbCount >= 3 && metricCount >= 2) {
            impactScore = (int) (ATSVocabulary.WEIGHT_IMPACT * 0.8);
            result.getStrengths().add("CV có một số số liệu và action verbs");
        } else if (actionVerbCount >= 2 || metricCount >= 1) {
            impactScore = (int) (ATSVocabulary.WEIGHT_IMPACT * 0.5);
            result.getWeaknesses().add("CV thiếu số liệu cụ thể và action verbs");
            result.getSuggestions().add("MEDIUM: Viết lại các bullet point theo format 'Action + Metric + Result' (ví dụ: 'Tăng 30% hiệu suất', 'Giảm 50% thời gian xử lý')");
        } else {
            impactScore = (int) (ATSVocabulary.WEIGHT_IMPACT * 0.2);
            result.getIssues().add("CV thiếu số liệu và action verbs, khó đánh giá tác động");
            result.getWeaknesses().add("Nội dung CV mô tả chung chung, thiếu bằng chứng cụ thể");
            result.getSuggestions().add("HIGH: Thêm số liệu cụ thể (%, số lượng, thời gian) và action verbs (developed, optimized, increased...)");
        }

        // ==================== CALCULATE FINAL SCORE ====================
        int rawScore = contactScore + structureScore + lengthScore + headerScore + impactScore;
        rawScore = Math.max(0, Math.min(100, rawScore));

        // Chuẩn hóa theo thang điểm ATS (khó đạt điểm tuyệt đối hơn)
        int totalScore = normalizeScoreForATS(rawScore);

        // Set breakdown scores
        result.getBreakdown().put("contact", contactScore);
        result.getBreakdown().put("structure", structureScore);
        result.getBreakdown().put("length", lengthScore);
        result.getBreakdown().put("header", headerScore);
        result.getBreakdown().put("impact", impactScore);

        // Set level label and verdict (dựa trên điểm đã chuẩn hóa)
        if (totalScore >= ATSVocabulary.THRESHOLD_EXCELLENT) {
            result.setLevelLabel("Xuất sắc");
            result.setVerdict("Đạt");
        } else if (totalScore >= ATSVocabulary.THRESHOLD_GOOD) {
            result.setLevelLabel("Tốt");
            result.setVerdict("Đạt");
        } else if (totalScore >= ATSVocabulary.THRESHOLD_AVERAGE) {
            result.setLevelLabel("Trung bình");
            result.setVerdict("Cần cải thiện");
        } else {
            result.setLevelLabel("Yếu");
            result.setVerdict("Không đạt");
        }

        result.setScore(totalScore);

        // ==================== PRIORITIZE AND LIMIT SUGGESTIONS ====================
        List<String> prioritizedSuggestions = prioritizeSuggestions(result.getSuggestions());
        result.setSuggestions(prioritizedSuggestions.subList(0, 
            Math.min(ATSVocabulary.MAX_SUGGESTIONS, prioritizedSuggestions.size())));

        // ==================== UI HINTS ====================
        Map<String, Object> uiHints = new HashMap<>();
        uiHints.put("atsReadability", calculateATSReadability(contactScore, structureScore, headerScore));
        uiHints.put("contentImpact", calculateContentImpact(impactScore, actionVerbCount, metricCount));
        uiHints.put("wordCount", wordCount);
        uiHints.put("sectionCount", sectionCount);
        uiHints.put("hasMetrics", metricCount > 0);
        uiHints.put("hasActionVerbs", actionVerbCount > 0);
        result.setUiHints(uiHints);

        return result;
    }

    /**
     * Detect CV sections using heading patterns
     */
    private Map<String, Boolean> detectSections(String originalText, String normalizedText) {
        Map<String, Boolean> sections = new HashMap<>();
        
        // Check for section headings (more accurate)
        String[] lines = originalText.split("\\r?\\n");
        Set<String> foundHeadings = new HashSet<>();
        
        for (String line : lines) {
            String normalizedLine = ATSVocabulary.normalize(line);
            if (ATSVocabulary.containsAny(normalizedLine, ATSVocabulary.SKILLS_HEADINGS)) {
                foundHeadings.add("skills");
            }
            if (ATSVocabulary.containsAny(normalizedLine, ATSVocabulary.EDUCATION_HEADINGS)) {
                foundHeadings.add("education");
            }
            if (ATSVocabulary.containsAny(normalizedLine, ATSVocabulary.EXPERIENCE_HEADINGS)) {
                foundHeadings.add("experience");
            }
            if (ATSVocabulary.containsAny(normalizedLine, ATSVocabulary.PROJECTS_HEADINGS)) {
                foundHeadings.add("projects");
            }
        }
        
        // Fallback: check if keywords appear in text (less accurate but catches more)
        sections.put("skills", foundHeadings.contains("skills") || 
            ATSVocabulary.containsAny(normalizedText, ATSVocabulary.SKILLS_HEADINGS));
        sections.put("education", foundHeadings.contains("education") || 
            ATSVocabulary.containsAny(normalizedText, ATSVocabulary.EDUCATION_HEADINGS));
        sections.put("experience", foundHeadings.contains("experience") || 
            ATSVocabulary.containsAny(normalizedText, ATSVocabulary.EXPERIENCE_HEADINGS));
        sections.put("projects", foundHeadings.contains("projects") || 
            ATSVocabulary.containsAny(normalizedText, ATSVocabulary.PROJECTS_HEADINGS));
        
        return sections;
    }

    /**
     * Count metrics in text (numbers, percentages, metric keywords)
     */
    private int countMetrics(String text) {
        int count = 0;
        
        // Count percentages
        if (PERCENTAGE_PATTERN.matcher(text).find()) {
            count += 2; // Percentages are strong indicators
        }
        
        // Count metric keywords
        count += ATSVocabulary.countOccurrences(text, ATSVocabulary.ALL_METRIC_KEYWORDS);
        
        // Count number patterns near action verbs or metric keywords
        // (simplified: just count if numbers appear)
        if (NUMBER_PATTERN.matcher(text).find()) {
            count += 1;
        }
        
        return count;
    }

    /**
     * Prioritize suggestions: HIGH -> MEDIUM -> LOW
     */
    private List<String> prioritizeSuggestions(List<String> suggestions) {
        List<String> high = new ArrayList<>();
        List<String> medium = new ArrayList<>();
        List<String> low = new ArrayList<>();
        
        for (String suggestion : suggestions) {
            String upper = suggestion.toUpperCase();
            if (upper.startsWith("HIGH:")) {
                high.add(suggestion);
            } else if (upper.startsWith("MEDIUM:")) {
                medium.add(suggestion);
            } else if (upper.startsWith("LOW:")) {
                low.add(suggestion);
            } else {
                // Default to medium if no priority specified
                medium.add(suggestion);
            }
        }
        
        List<String> prioritized = new ArrayList<>();
        prioritized.addAll(high);
        prioritized.addAll(medium);
        prioritized.addAll(low);
        
        return prioritized;
    }

    /**
     * Calculate ATS Readability score (0-100)
     */
    private int calculateATSReadability(int contactScore, int structureScore, int headerScore) {
        int maxScore = ATSVocabulary.WEIGHT_CONTACT + ATSVocabulary.WEIGHT_STRUCTURE + ATSVocabulary.WEIGHT_HEADER;
        int actualScore = contactScore + structureScore + headerScore;
        return (int) ((double) actualScore / maxScore * 100);
    }

    /**
     * Calculate Content Impact score (0-100)
     */
    private int calculateContentImpact(int impactScore, int actionVerbCount, int metricCount) {
        int maxScore = ATSVocabulary.WEIGHT_IMPACT;
        int baseScore = (int) ((double) impactScore / maxScore * 100);
        
        // Bonus for having both action verbs and metrics
        if (actionVerbCount >= 3 && metricCount >= 2) {
            baseScore = Math.min(100, baseScore + 10);
        }
        
        return baseScore;
    }

    /**
     * Normalize raw score to a stricter ATS-like scale (harder to reach very high scores)
     */
    private int normalizeScoreForATS(int rawScore) {
        if (rawScore <= 0) {
            return 0;
        }
        // Giới hạn tối đa 100 trước khi scale
        int capped = Math.min(100, rawScore);
        // Nén lại một chút để khó đạt điểm rất cao và tránh 100 tuyệt đối
        double scaled = capped * 0.95; // giảm ~5%
        int normalized = (int) Math.round(scaled);
        // Đảm bảo trần 95
        return Math.max(0, Math.min(95, normalized));
    }
}
