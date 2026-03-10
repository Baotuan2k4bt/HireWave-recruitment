package com.example.hirewave.service.scoreCVService;

import java.util.*;

/**
 * Vocabulary/Dictionary for ATS Simulator
 * Rule-based training data for multi-language CV analysis
 * 
 * This class contains all the keywords, patterns, and rules
 * used by the ATS Simulator to evaluate CVs.
 */
public class ATSVocabulary {
    
    // ==================== SECTION HEADINGS ====================
    /**
     * Skills section keywords (Vietnamese and English)
     */
    public static final List<String> SKILLS_HEADINGS = Arrays.asList(
        // English
        "skills", "technical skills", "core competencies", "competencies",
        "expertise", "abilities", "proficiencies", "technologies",
        // Vietnamese
        "kỹ năng", "kỹ năng chuyên môn", "kỹ năng kỹ thuật", "năng lực",
        "khả năng", "chuyên môn", "công nghệ"
    );
    
    /**
     * Education section keywords
     */
    public static final List<String> EDUCATION_HEADINGS = Arrays.asList(
        // English
        "education", "academic background", "qualifications", "degrees",
        "university", "college", "schooling",
        // Vietnamese
        "học vấn", "học tập", "giáo dục", "bằng cấp", "trình độ học vấn",
        "đại học", "học viện", "trường học"
    );
    
    /**
     * Experience section keywords
     */
    public static final List<String> EXPERIENCE_HEADINGS = Arrays.asList(
        // English
        "experience", "work experience", "employment", "employment history",
        "professional experience", "career", "work history", "positions",
        "roles", "employment record",
        // Vietnamese
        "kinh nghiệm", "kinh nghiệm làm việc", "công việc", "nghề nghiệp",
        "việc làm", "quá trình làm việc", "lịch sử công việc"
    );
    
    /**
     * Projects section keywords
     */
    public static final List<String> PROJECTS_HEADINGS = Arrays.asList(
        // English
        "projects", "project", "portfolio", "work samples", "sample projects",
        "key projects", "notable projects", "capstone", "personal projects",
        // Vietnamese
        "dự án", "đồ án", "project", "portfolio", "mẫu công việc",
        "dự án nổi bật", "dự án cá nhân", "đồ án tốt nghiệp"
    );
    
    /**
     * All section headings combined
     */
    public static final List<String> ALL_SECTION_HEADINGS = new ArrayList<String>() {{
        addAll(SKILLS_HEADINGS);
        addAll(EDUCATION_HEADINGS);
        addAll(EXPERIENCE_HEADINGS);
        addAll(PROJECTS_HEADINGS);
    }};
    
    // ==================== ACTION VERBS ====================
    /**
     * Action verbs (English) - for detecting impact statements
     */
    public static final List<String> ACTION_VERBS_EN = Arrays.asList(
        "developed", "built", "created", "designed", "implemented",
        "optimized", "improved", "increased", "reduced", "decreased",
        "managed", "led", "coordinated", "executed", "delivered",
        "achieved", "accomplished", "established", "launched", "deployed",
        "maintained", "enhanced", "upgraded", "migrated", "refactored",
        "automated", "streamlined", "integrated", "collaborated", "mentored"
    );
    
    /**
     * Action verbs (Vietnamese) - for detecting impact statements
     */
    public static final List<String> ACTION_VERBS_VN = Arrays.asList(
        "xây dựng", "phát triển", "tạo ra", "thiết kế", "triển khai",
        "tối ưu", "cải thiện", "tăng", "giảm", "quản lý",
        "dẫn dắt", "phối hợp", "thực hiện", "giao hàng", "đạt được",
        "hoàn thành", "thiết lập", "khởi chạy", "triển khai", "bảo trì",
        "nâng cấp", "nâng cao", "di chuyển", "tái cấu trúc", "tự động hóa",
        "tối ưu hóa", "tích hợp", "hợp tác", "hướng dẫn"
    );
    
    /**
     * All action verbs combined
     */
    public static final List<String> ALL_ACTION_VERBS = new ArrayList<String>() {{
        addAll(ACTION_VERBS_EN);
        addAll(ACTION_VERBS_VN);
    }};
    
    // ==================== METRIC KEYWORDS ====================
    /**
     * Metric keywords (English) - for detecting quantifiable achievements
     */
    public static final List<String> METRIC_KEYWORDS_EN = Arrays.asList(
        "%", "percent", "percentage", "users", "customers", "clients",
        "ms", "milliseconds", "seconds", "minutes", "hours", "days",
        "requests", "queries", "transactions", "revenue", "sales",
        "kpi", "key performance", "metrics", "uptime", "availability",
        "throughput", "latency", "response time", "load", "traffic",
        "cost", "budget", "efficiency", "productivity", "growth",
        "reduction", "increase", "decrease", "improvement", "optimization"
    );
    
    /**
     * Metric keywords (Vietnamese) - for detecting quantifiable achievements
     */
    public static final List<String> METRIC_KEYWORDS_VN = Arrays.asList(
        "%", "phần trăm", "người dùng", "khách hàng", "client",
        "giây", "phút", "giờ", "ngày", "tháng", "năm",
        "yêu cầu", "truy vấn", "giao dịch", "doanh thu", "bán hàng",
        "kpi", "chỉ số", "hiệu suất", "thời gian phản hồi", "tải",
        "lưu lượng", "chi phí", "ngân sách", "hiệu quả", "năng suất",
        "tăng trưởng", "giảm", "tăng", "cải thiện", "tối ưu"
    );
    
    /**
     * All metric keywords combined
     */
    public static final List<String> ALL_METRIC_KEYWORDS = new ArrayList<String>() {{
        addAll(METRIC_KEYWORDS_EN);
        addAll(METRIC_KEYWORDS_VN);
    }};
    
    // ==================== PATTERNS ====================
    /**
     * Email pattern
     */
    public static final String EMAIL_PATTERN = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}";
    
    /**
     * Phone pattern (flexible)
     */
    public static final String PHONE_PATTERN = "(\\+?\\d[\\d\\s\\-()]{7,})";
    
    /**
     * Section heading pattern (matches headings like "Skills:", "Kỹ năng:", "EDUCATION")
     */
    public static final String SECTION_HEADING_PATTERN = 
        "^\\s*(?i)(skills|kỹ năng|education|học vấn|experience|kinh nghiệm|projects|dự án|đồ án)" +
        "\\s*[:\\-]?\\s*$";
    
    /**
     * Number pattern (for detecting metrics)
     */
    public static final String NUMBER_PATTERN = "\\d+(\\.\\d+)?";
    
    /**
     * Percentage pattern
     */
    public static final String PERCENTAGE_PATTERN = "\\d+(\\.\\d+)?\\s*%";
    
    // ==================== SCORING CONSTANTS ====================
    /**
     * Score weights for each criterion
     */
    public static final int WEIGHT_CONTACT = 25;      // Contact info (HIGH priority)
    public static final int WEIGHT_STRUCTURE = 20;   // CV structure
    public static final int WEIGHT_LENGTH = 15;      // Content length
    public static final int WEIGHT_HEADER = 10;      // Header placement
    public static final int WEIGHT_IMPACT = 30;      // Content impact (metrics, action verbs)
    
    /**
     * Score thresholds for level labels (điểm đã được chuẩn hóa, nghiêng về chuẩn ATS – khó đạt mức rất cao)
     */
    public static final int THRESHOLD_EXCELLENT = 90;
    public static final int THRESHOLD_GOOD = 75;
    public static final int THRESHOLD_AVERAGE = 60;
    // Below 60 = Weak
    
    /**
     * Word count thresholds
     */
    public static final int MIN_WORDS = 100;
    public static final int OPTIMAL_MIN_WORDS = 150;
    public static final int OPTIMAL_MAX_WORDS = 800;
    public static final int MAX_WORDS = 900;
    
    /**
     * Header check range (first N characters)
     */
    public static final int HEADER_CHECK_RANGE = 300;
    
    /**
     * Minimum sections required
     */
    public static final int MIN_SECTIONS_REQUIRED = 2;
    
    /**
     * Maximum suggestions to return
     */
    public static final int MAX_SUGGESTIONS = 5;
    
    /**
     * Normalize text for comparison
     */
    public static String normalize(String text) {
        if (text == null || text.isBlank()) {
            return "";
        }
        return text.toLowerCase()
                .replaceAll("\\s+", " ")
                .replaceAll("[\\p{Punct}&&[^@.]]", "")
                .trim();
    }
    
    /**
     * Check if text contains any of the keywords (case-insensitive)
     */
    public static boolean containsAny(String text, List<String> keywords) {
        if (text == null || text.isBlank() || keywords == null || keywords.isEmpty()) {
            return false;
        }
        String normalized = normalize(text);
        return keywords.stream().anyMatch(keyword -> 
            normalized.contains(normalize(keyword))
        );
    }
    
    /**
     * Count occurrences of keywords in text
     */
    public static int countOccurrences(String text, List<String> keywords) {
        if (text == null || text.isBlank() || keywords == null || keywords.isEmpty()) {
            return 0;
        }
        String normalized = normalize(text);
        return (int) keywords.stream()
                .filter(keyword -> normalized.contains(normalize(keyword)))
                .count();
    }
}
