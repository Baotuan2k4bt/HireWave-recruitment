package com.example.hirewave;

import com.example.hirewave.dto.AIMatching.MatchingFeatures;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class AISummaryGenerator {

    public String generate(double finalScore, MatchingFeatures f, String jobTitle) {

        StringBuilder sb = new StringBuilder();

        String title = (jobTitle == null || jobTitle.isBlank()) ? "vị trí này" : jobTitle;

        // 1) Đánh giá tổng quan
        if (finalScore >= 80) {
            sb.append("Bạn có mức độ phù hợp cao với ").append(title).append(". ");
        } else if (finalScore >= 60) {
            sb.append("Bạn có mức độ phù hợp khá với ").append(title).append(". ");
        } else if (finalScore >= 40) {
            sb.append("Bạn có mức độ phù hợp ở mức trung bình với ").append(title).append(". ");
        } else {
            sb.append("Mức độ phù hợp của bạn với ").append(title).append(" hiện chưa cao. ");
        }

        // 2) Phân tích kỹ năng & từ khóa
        double skillRatio = f.getSkillRatio();
        double keywordDensity = f.getKeywordDensity();
         List<String> matched = safeList(f.getMatchedSkills());
        List<String> missing = safeList(f.getMissingSkills());

        boolean hasAnySkillSignal = skillRatio > 0 || keywordDensity > 0 || !matched.isEmpty() || !missing.isEmpty();
        if (!hasAnySkillSignal) {
            sb.append("Hiện hệ thống chưa có đủ dữ liệu kỹ năng (tin tuyển dụng có thể chưa liệt kê kỹ năng, hoặc CV chưa trích xuất được kỹ năng). ");
        } else {
            sb.append("Kỹ năng phù hợp khoảng ").append(pct(skillRatio)).append(". ");

            if (!matched.isEmpty()) {
                sb.append("Điểm mạnh: ").append(limitList(matched, 5)).append(". ");
            }
            if (!missing.isEmpty()) {
                sb.append("Nên bổ sung: ").append(limitList(missing, 5)).append(". ");
            }

            if (keywordDensity > 0) {
                if (keywordDensity >= 0.7) {
                    sb.append("CV thể hiện khá đầy đủ các từ khóa quan trọng trong JD, giúp nhà tuyển dụng dễ nhận diện sự phù hợp. ");
                } else if (keywordDensity <= 0.3) {
                    sb.append("CV hiện chưa thể hiện nhiều từ khóa trùng với JD, bạn có thể bổ sung các công nghệ/kỹ năng cốt lõi để tăng khả năng được hệ thống và nhà tuyển dụng chú ý. ");
                }
            }
        }

        // 3) Kinh nghiệm & định hướng chức danh
        double expRatio = f.getExpRatio();
        if (expRatio >= 1.0) {
            sb.append("Kinh nghiệm của bạn đáp ứng yêu cầu (").append(pctClamp(expRatio)).append("). ");
            if (expRatio >= 1.3) {
                sb.append("Bạn thậm chí có thể cân nhắc các cơ hội ở level cao hơn (ví dụ Senior/Lead) tùy vào định hướng cá nhân. ");
            }
        } else {
            sb.append("Kinh nghiệm hiện tại đạt khoảng ").append(pctClamp(expRatio)).append(" so với yêu cầu. ");
            if (expRatio <= 0.6 && !missing.isEmpty()) {
                sb.append("Đây là hồ sơ tiềm năng, phù hợp nếu công ty có chương trình đào tạo hoặc mentor để bạn phát triển thêm. ");
            }
        }

        double titleSim = f.getTitleSimilarity();
        if (titleSim >= 0.75) {
            sb.append("Chức danh/định hướng nghề nghiệp khá sát với vị trí. ");
        } else if (titleSim >= 0.5) {
            sb.append("Chức danh có liên quan nhưng chưa thật sự trùng khớp. ");
        } else {
            sb.append("Chức danh/định hướng nghề nghiệp chưa khớp rõ ràng. ");
        }

        sb.append("(*) Lưu ý: Đây là đánh giá tự động dựa trên dữ liệu CV và nội dung tin tuyển dụng, không thay thế cho đánh giá cuối cùng từ nhà tuyển dụng.");

        return sb.toString();
    }

    private List<String> safeList(List<String> in) {
        return in == null ? List.of() : in.stream()
                .filter(s -> s != null && !s.isBlank())
                .collect(Collectors.toList());
    }

    private String limitList(List<String> list, int n) {
        return list.stream().limit(n).collect(Collectors.joining(", "));
    }

    private String pct(double ratio) {
        double v = Math.max(0.0, Math.min(1.0, ratio));
        return Math.round(v * 100) + "%";
    }

    private String pctClamp(double ratio) {
        // expRatio can be >1 in some flows; clamp for display clarity
        double v = Math.max(0.0, Math.min(1.0, ratio));
        return Math.round(v * 100) + "%";
    }
}
