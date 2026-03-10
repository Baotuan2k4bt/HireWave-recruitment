package com.example.hirewave.service.AIMatching;

import com.example.hirewave.dto.AIMatching.MatchingFeatures;
import com.example.hirewave.entity.Applicant;
import com.example.hirewave.entity.Job;
import com.example.hirewave.entity.UserResume;
import com.example.hirewave.service.ResumeParser;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service

public class DefaultMatchingFeatureExtractor implements MatchingFeatureExtractor {
    private final ResumeParser resumeParser;

    public DefaultMatchingFeatureExtractor(ResumeParser resumeParser) {
        this.resumeParser = resumeParser;
    }

    @Override
    public MatchingFeatures extract(Job job, UserResume resume) {
        Map<String, Object> parsed = parseOrThrow(resume.getContent());
        return buildFeaturesFromParsed(job, parsed);
    }

    @Override
    public MatchingFeatures extractFromApplicant(Applicant applicant, Job job) {
        // Prefer pre-extracted/denormalized data to avoid re-parsing PDFs.
        Set<String> jobSkills = normalize(job.getSkillsRequired());

        // 1) Candidate skills: use Applicant.skills if present, else infer from extractedText, else parse PDF as fallback.
        Set<String> candidateSkills = new HashSet<>();
        String rawTextLower = "";

        if (applicant != null) {
            if (applicant.getSkills() != null && !applicant.getSkills().isBlank()) {
                candidateSkills = normalize(Arrays.asList(applicant.getSkills().split(",")));
            }

            if (applicant.getExtractedText() != null && !applicant.getExtractedText().isBlank()) {
                rawTextLower = applicant.getExtractedText().toLowerCase();
                // If we still don't have candidate skills, infer a minimal set by scanning for job skills in extracted text.
                if (candidateSkills.isEmpty() && !jobSkills.isEmpty()) {
                    for (String s : jobSkills) {
                        if (!s.isBlank() && rawTextLower.contains(s)) {
                            candidateSkills.add(s);
                        }
                    }
                }
            }

            if (candidateSkills.isEmpty() && (applicant.getResume() != null && applicant.getResume().length > 0)) {
                Map<String, Object> parsed = parseOrThrow(applicant.getResume());
                candidateSkills = normalize(flattenSkills(parsed.get("skills")));
                rawTextLower = String.valueOf(parsed.getOrDefault("rawText", "")).toLowerCase();
            }
        }

        return buildFeatures(job, jobSkills, candidateSkills, rawTextLower, null);
    }

    private Map<String, Object> parseOrThrow(byte[] pdfBytes) {
        try {
            return resumeParser.parseResume(pdfBytes);
        } catch (Exception e) {
            throw new RuntimeException("Không thể phân tích CV", e);
        }
    }

    private MatchingFeatures buildFeaturesFromParsed(Job job, Map<String, Object> parsed) {
        Set<String> jobSkills = normalize(job.getSkillsRequired());
        Set<String> candidateSkills = normalize(flattenSkills(parsed.get("skills")));
        String rawTextLower = String.valueOf(parsed.getOrDefault("rawText", "")).toLowerCase();
        return buildFeatures(job, jobSkills, candidateSkills, rawTextLower, parsed);
    }

    private MatchingFeatures buildFeatures(
            Job job,
            Set<String> jobSkills,
            Set<String> candidateSkills,
            String rawTextLower,
            Map<String, Object> parsedOrNull
    ) {
        double skillRatio = calculateSkillRatio(candidateSkills, jobSkills);
        double skillCosine = calculateCosine(candidateSkills, jobSkills);
        double expRatio = calculateExpRatio(parsedOrNull, rawTextLower, job);
        double titleSimilarity = calculateTitleSimilarity(parsedOrNull, rawTextLower, job);
        double keywordDensity = calculateKeywordDensity(rawTextLower, jobSkills);

        List<String> matchedSkills = matchedSkills(candidateSkills, jobSkills);
        List<String> missingSkills = missingSkills(candidateSkills, jobSkills);

        return MatchingFeatures.builder()
                .skillRatio(skillRatio)
                .skillCosine(skillCosine)
                .expRatio(expRatio)
                .titleSimilarity(titleSimilarity)
                .keywordDensity(keywordDensity)
                .matchedSkills(matchedSkills)
                .missingSkills(missingSkills)
                .build();
    }

    private Set<String> normalize(Collection<String> list) {
        return list == null ? new HashSet<>() :
                list.stream()
                        .map(s -> s.toLowerCase().trim())
                        .filter(s -> !s.isBlank())
                        .collect(Collectors.toSet());
    }

    /**
     * ResumeParser hiện trả skills dạng Map<Category, List<Skill>>.
     * Function này flatten về 1 list skill để tính matching.
     */
    @SuppressWarnings("unchecked")
    private List<String> flattenSkills(Object skillsObj) {
        if (skillsObj == null) return List.of();
        if (skillsObj instanceof List<?> list) {
            return list.stream().map(String::valueOf).toList();
        }
        if (skillsObj instanceof Map<?, ?> map) {
            List<String> out = new ArrayList<>();
            for (Object v : map.values()) {
                if (v instanceof List<?> l) {
                    for (Object x : l) out.add(String.valueOf(x));
                }
            }
            return out;
        }
        return List.of();
    }

    private double calculateSkillRatio(Set<String> candidate, Set<String> required) {
        if (required.isEmpty()) return 0;
        long matched = required.stream().filter(candidate::contains).count();
        return (double) matched / required.size();
    }
    private double calculateCosine(Set<String> a, Set<String> b) {
        if (a.isEmpty() || b.isEmpty()) return 0;

        Set<String> union = new HashSet<>(a);
        union.addAll(b);

        int dot = 0;
        for (String s : union) {
            int x = a.contains(s) ? 1 : 0;
            int y = b.contains(s) ? 1 : 0;
            dot += x * y;
        }

        double normA = Math.sqrt(a.size());
        double normB = Math.sqrt(b.size());

        return dot / (normA * normB);
    }

    private double calculateExpRatio(Map<String, Object> parsedOrNull, String rawTextLower, Job job) {
        int candidateYears = 0;
        if (parsedOrNull != null) {
            Object v = parsedOrNull.get("totalExpYears");
            if (v instanceof Number n) {
                candidateYears = n.intValue();
            } else {
                // Best-effort: infer from extracted experience dates if present
                Object expObj = parsedOrNull.get("experience");
                candidateYears = estimateExperienceYearsFromExperienceList(expObj);
            }
        }
        if (candidateYears == 0 && rawTextLower != null && !rawTextLower.isBlank()) {
            candidateYears = estimateExperienceYearsFromText(rawTextLower);
        }

        int min = extractMinExperienceFromText(job.getExperience());
        if (min == 0) return 0.5;

        return Math.min(1.0, (double) candidateYears / min);
    }

    private int extractMinExperienceFromText(String expText) {
        if (expText == null) return 0;

        try {
            String digits = expText.replaceAll("[^0-9]", "");
            if (digits.isBlank()) return 0;
            return Integer.parseInt(digits);
        } catch (Exception e) {
            return 0;
        }
    }


    private double calculateTitleSimilarity(Map<String, Object> parsedOrNull, String rawTextLower, Job job) {
        String jobTitle = job.getJobTitle() == null ? "" : job.getJobTitle().toLowerCase();
        if (jobTitle.isBlank()) return 0.0;

        String candidate = "";
        if (parsedOrNull != null) {
            Object v = parsedOrNull.get("jobTitle");
            if (v != null) candidate = String.valueOf(v).toLowerCase();

            // If parser doesn't provide jobTitle, try first experience title
            if (candidate.isBlank()) {
                Object expObj = parsedOrNull.get("experience");
                candidate = firstExperienceTitle(expObj).toLowerCase();
            }
        }

        if (candidate.contains(jobTitle)) return 1.0;
        if (rawTextLower != null && !rawTextLower.isBlank() && rawTextLower.contains(jobTitle)) return 0.75;
        if (candidate.isBlank()) return 0.0;
        return 0.5;
    }

    private double calculateKeywordDensity(String rawTextLower, Set<String> jobSkills) {
        if (jobSkills == null || jobSkills.isEmpty()) return 0;
        if (rawTextLower == null || rawTextLower.isBlank()) return 0;

        long matched = jobSkills.stream().filter(s -> !s.isBlank() && rawTextLower.contains(s)).count();
        return (double) matched / jobSkills.size();
    }

    private List<String> matchedSkills(Set<String> candidate, Set<String> required) {
        if (required == null || required.isEmpty()) return List.of();
        if (candidate == null || candidate.isEmpty()) return List.of();
        return required.stream().filter(candidate::contains).sorted().toList();
    }

    private List<String> missingSkills(Set<String> candidate, Set<String> required) {
        if (required == null || required.isEmpty()) return List.of();
        final Set<String> candidateSafe = (candidate != null) ? candidate : Set.of();
        return required.stream().filter(s -> !candidateSafe.contains(s)).sorted().toList();
    }

    @SuppressWarnings("unchecked")
    private String firstExperienceTitle(Object expObj) {
        if (!(expObj instanceof List<?> list) || list.isEmpty()) return "";
        Object first = list.get(0);
        if (first instanceof Map<?, ?> m) {
            Object title = m.get("title");
            return title == null ? "" : String.valueOf(title);
        }
        return "";
    }

    private int estimateExperienceYearsFromText(String rawTextLower) {
        // Very lightweight heuristic: use min/max year seen in text.
        // Works for "2019 - 2022" / "2020–2023" patterns.
        try {
            java.util.regex.Matcher matcher = java.util.regex.Pattern.compile("\\b(19|20)\\d{2}\\b").matcher(rawTextLower);
            int min = Integer.MAX_VALUE;
            int max = Integer.MIN_VALUE;
            while (matcher.find()) {
                int y = Integer.parseInt(matcher.group());
                min = Math.min(min, y);
                max = Math.max(max, y);
            }
            if (min == Integer.MAX_VALUE || max == Integer.MIN_VALUE) return 0;
            if (max < min) return 0;
            return Math.min(40, Math.max(0, max - min)); // cap to avoid crazy values
        } catch (Exception e) {
            return 0;
        }
    }

    private int estimateExperienceYearsFromExperienceList(Object expObj) {
        // If we have extracted experience list, try to parse any year ranges inside.
        if (!(expObj instanceof List<?> list) || list.isEmpty()) return 0;
        int min = Integer.MAX_VALUE;
        int max = Integer.MIN_VALUE;
        java.util.regex.Pattern p = java.util.regex.Pattern.compile("\\b(19|20)\\d{2}\\b");
        for (Object item : list) {
            if (!(item instanceof Map<?, ?> m)) continue;
            Object datesObj = m.get("dates");
            if (datesObj == null) continue;
            java.util.regex.Matcher matcher = p.matcher(String.valueOf(datesObj));
            while (matcher.find()) {
                int y = Integer.parseInt(matcher.group());
                min = Math.min(min, y);
                max = Math.max(max, y);
            }
        }
        if (min == Integer.MAX_VALUE || max == Integer.MIN_VALUE) return 0;
        if (max < min) return 0;
        return Math.min(40, Math.max(0, max - min));
    }
}
