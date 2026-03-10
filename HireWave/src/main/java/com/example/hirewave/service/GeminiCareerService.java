package com.example.hirewave.service;

import com.example.hirewave.dto.CareerFitRequest;
import com.example.hirewave.dto.CareerFitResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiCareerService {

    private static final Logger log = LoggerFactory.getLogger(GeminiCareerService.class);

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.model:gemini-2.5-flash}")
    private String model;

    @Value("${gemini.base-url:https://generativelanguage.googleapis.com/v1beta/models}")
    private String baseUrl;

    private static final List<String> INDUSTRIES = List.of(
            "Công nghệ thông tin",
            "Marketing – Truyền thông",
            "Kinh doanh – Bán hàng",
            "Tài chính – Ngân hàng",
            "Nhân sự",
            "Thiết kế – Sáng tạo",
            "Logistics – Chuỗi cung ứng",
            "Giáo dục – Đào tạo",
            "Y tế – Chăm sóc sức khỏe",
            "Du lịch – Nhà hàng – Khách sạn",
            "Xây dựng – Kỹ thuật",
            "Sản xuất – Công nghiệp",
            "Luật – Pháp lý",
            "Hành chính – Văn phòng",
            "Dữ liệu – Phân tích – AI"
    );

    public GeminiCareerService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public CareerFitResponse careerFit(CareerFitRequest req) {
        // ✅ Robust: nếu chưa có từ properties/env thì thử lấy từ System property/env trực tiếp
        String key = resolveApiKey();
        if (key == null || key.isBlank()) {
            throw new RuntimeException("Missing GEMINI_API_KEY. Set ENV GEMINI_API_KEY or VM option -DGEMINI_API_KEY=...");
        }

        String url = baseUrl + "/" + model + ":generateContent?key=" + key;

        String prompt = buildPrompt(req);
        Map<String, Object> schema = buildJsonSchema();

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("contents", List.of(
                Map.of("role", "user", "parts", List.of(Map.of("text", prompt)))
        ));
        body.put("generationConfig", Map.of(
                "temperature", 0.35,
                "responseMimeType", "application/json",
                "responseSchema", schema
        ));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<String> res;
        try {
            res = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    new HttpEntity<>(body, headers),
                    String.class
            );
        } catch (RestClientException ex) {
            log.error("Error calling Gemini API", ex);
            throw new RuntimeException("Failed to call Gemini API", ex);
        }

        if (!res.getStatusCode().is2xxSuccessful()) {
            String errorBody = Optional.ofNullable(res.getBody()).orElse("");
            // ❗Không log apiKey
            log.error("Gemini API returned non-2xx status: {}, body: {}", res.getStatusCode(), errorBody);
            throw new RuntimeException("Gemini API error: " + res.getStatusCode());
        }

        String raw = res.getBody();
        if (raw == null || raw.isBlank()) throw new RuntimeException("Empty Gemini response");

        try {
            JsonNode root = objectMapper.readTree(raw);
            JsonNode textNode = root.path("candidates").path(0)
                    .path("content").path("parts").path(0).path("text");

            if (textNode.isMissingNode() || textNode.asText().isBlank()) {
                throw new RuntimeException("Gemini returned no JSON text");
            }

            CareerFitResponse parsed = objectMapper.readValue(textNode.asText(), CareerFitResponse.class);
            return normalizeAndValidate(parsed);

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Gemini JSON", e);
        }
    }

    private String resolveApiKey() {
        // 1) từ application.properties/env
        if (apiKey != null && !apiKey.isBlank()) return apiKey.trim();

        // 2) từ VM option -DGEMINI_API_KEY=...
        String prop = System.getProperty("GEMINI_API_KEY");
        if (prop != null && !prop.isBlank()) return prop.trim();

        // 3) từ env GEMINI_API_KEY
        String env = System.getenv("GEMINI_API_KEY");
        if (env != null && !env.isBlank()) return env.trim();

        // 4) fallback (nếu bạn muốn đặt -DGEMINI_API_KEY thì cũng map luôn)
        String prop2 = System.getProperty("DGEMINI_API_KEY");
        if (prop2 != null && !prop2.isBlank()) return prop2.trim();

        return "";
    }

    private String buildPrompt(CareerFitRequest req) {
        String skills = (req.skills() == null || req.skills().isEmpty())
                ? "Không cung cấp"
                : String.join(", ", req.skills());

        String preferred = (req.preferredIndustries() == null || req.preferredIndustries().isEmpty())
                ? "Không ưu tiên"
                : String.join(", ", req.preferredIndustries());

        return """
                Bạn là chuyên gia tư vấn nghề nghiệp đa ngành tại Việt Nam.
                Bạn phải trả về JSON đúng schema (không thêm text ngoài JSON).

                Danh mục ngành được phép (CHỈ chọn trong danh sách này):
                - %s

                Thông tin người dùng:
                - Cấp độ: %s
                - Mô tả: %s
                - Kỹ năng: %s
                - Ngành ưu tiên: %s
                - Mức độ giao tiếp (0-100): %s
                - Mức độ phân tích (0-100): %s
                - Mức độ sáng tạo (0-100): %s
                - Ưu tiên ổn định (0-100): %s

                Yêu cầu đầu ra:
                - recommendedIndustries: 3-5 ngành (trong danh mục).
                - topJobs: đúng 5 gợi ý, thuộc ít nhất 3 ngành khác nhau nếu hợp lý.
                - Mỗi job: title ngắn gọn, industry (trong danh mục), matchScore 0-100, reason 1-2 câu cụ thể theo dữ liệu user.
                - roadmap30Days: 6-10 gạch đầu dòng, thực tế.
                - jobKeywords: 6-12 từ khóa để tìm việc.
                - overallScore: 0-100 (tổng quan độ phù hợp).
                """.formatted(
                String.join("\n- ", INDUSTRIES),
                safe(req.level()),
                safe(req.description()),
                skills,
                preferred,
                safeInt(req.socialLevel()),
                safeInt(req.analyticalLevel()),
                safeInt(req.creativityLevel()),
                safeInt(req.stabilityPreference())
        );
    }

    private String safe(String s) {
        return (s == null || s.isBlank()) ? "Không có" : s.trim();
    }

    private String safeInt(Integer v) {
        return String.valueOf(v == null ? 50 : Math.max(0, Math.min(100, v)));
    }

    private CareerFitResponse normalizeAndValidate(CareerFitResponse parsed) {
        if (parsed == null) {
            throw new RuntimeException("Gemini returned null CareerFitResponse");
        }

        List<CareerFitResponse.JobSuggestion> jobs = parsed.topJobs() == null ? List.of() : parsed.topJobs();
        if (jobs.isEmpty()) throw new RuntimeException("Gemini returned no job suggestions");

        List<CareerFitResponse.JobSuggestion> normalizedJobs = new ArrayList<>();
        for (CareerFitResponse.JobSuggestion job : jobs) {
            if (job == null) continue;
            int clamped = job.matchScore() == null ? 70 : Math.max(0, Math.min(100, job.matchScore()));
            normalizedJobs.add(new CareerFitResponse.JobSuggestion(
                    job.title(),
                    job.industry(),
                    clamped,
                    job.reason()
            ));
        }

        List<String> recommended = parsed.recommendedIndustries() == null ? List.of() : parsed.recommendedIndustries();
        List<String> filteredIndustries = recommended.stream()
                .filter(Objects::nonNull)
                .filter(ind -> INDUSTRIES.stream().anyMatch(allowed -> allowed.equalsIgnoreCase(ind)))
                .toList();

        if (filteredIndustries.isEmpty() && !recommended.isEmpty()) {
            filteredIndustries = recommended; // best-effort
        }

        Integer overall = parsed.overallScore();
        if (overall == null) {
            int avg = (int) Math.round(normalizedJobs.stream()
                    .map(CareerFitResponse.JobSuggestion::matchScore)
                    .filter(Objects::nonNull)
                    .mapToInt(Integer::intValue)
                    .average().orElse(70));
            overall = avg;
        } else {
            overall = Math.max(0, Math.min(100, overall));
        }

        return new CareerFitResponse(
                parsed.persona(),
                parsed.summary(),
                overall,
                filteredIndustries,
                normalizedJobs,
                parsed.strengths(),
                parsed.improvements(),
                parsed.roadmap30Days(),
                parsed.jobKeywords()
        );
    }

    private Map<String, Object> buildJsonSchema() {
        Map<String, Object> job = new LinkedHashMap<>();
        job.put("type", "object");
        job.put("properties", Map.of(
                "title", Map.of("type", "string"),
                "industry", Map.of("type", "string"),
                "matchScore", Map.of("type", "integer"),
                "reason", Map.of("type", "string")
        ));
        job.put("required", List.of("title", "industry", "matchScore", "reason"));

        Map<String, Object> schema = new LinkedHashMap<>();
        schema.put("type", "object");
        schema.put("properties", new LinkedHashMap<String, Object>() {{
            put("persona", Map.of("type", "string"));
            put("summary", Map.of("type", "string"));
            put("overallScore", Map.of("type", "integer"));
            put("recommendedIndustries", Map.of("type", "array", "items", Map.of("type", "string")));
            put("topJobs", Map.of("type", "array", "items", job));
            put("strengths", Map.of("type", "array", "items", Map.of("type", "string")));
            put("improvements", Map.of("type", "array", "items", Map.of("type", "string")));
            put("roadmap30Days", Map.of("type", "array", "items", Map.of("type", "string")));
            put("jobKeywords", Map.of("type", "array", "items", Map.of("type", "string")));
        }});
        schema.put("required", List.of(
                "persona", "summary", "overallScore",
                "recommendedIndustries", "topJobs",
                "strengths", "improvements",
                "roadmap30Days", "jobKeywords"
        ));
        return schema;
    }
}