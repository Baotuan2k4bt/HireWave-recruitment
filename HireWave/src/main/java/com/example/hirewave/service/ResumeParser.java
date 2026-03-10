package com.example.hirewave.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ResumeParser {

    // Common skills categorized for better matching
    private static final Map<String, List<String>> SKILL_CATEGORIES = new HashMap<>();
    static {
        SKILL_CATEGORIES.put("Programming Languages", Arrays.asList(
                "Java", "Python", "JavaScript", "TypeScript", "C\\+\\+", "C#", "Go", "Rust", "Kotlin", "Scala"
        ));
        SKILL_CATEGORIES.put("Frameworks", Arrays.asList(
                "Spring", "React", "Angular", "Vue.js", "Node.js", "Django", "Flask", "Express.js"
        ));
        SKILL_CATEGORIES.put("Databases", Arrays.asList(
                "SQL", "MySQL", "PostgreSQL", "MongoDB", "Oracle", "Redis", "Cassandra"
        ));
        SKILL_CATEGORIES.put("Cloud & DevOps", Arrays.asList(
                "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Jenkins", "Git", "CI/CD"
        ));
        SKILL_CATEGORIES.put("Web Technologies", Arrays.asList(
                "HTML", "CSS", "REST API", "GraphQL", "WebSocket"
        ));
    }

    public Map<String, Object> parseResume(byte[] pdfData) throws IOException {
        Map<String, Object> extractedInfo = new HashMap<>();
        if (pdfData == null || pdfData.length == 0) {
            throw new IOException("Invalid PDF data provided");
        }

        try (PDDocument document = PDDocument.load(new ByteArrayInputStream(pdfData))) {
            if (document.isEncrypted()) {
                throw new IOException("Cannot parse encrypted PDF");
            }

            PDFTextStripper stripper = new PDFTextStripper();
            String rawText = stripper.getText(document);
            String text = rawText.replaceAll("\\s+", " ").trim();

            // Useful for downstream logic (AI matching keyword density, etc.)
            extractedInfo.put("rawText", text);

            // Extract information
            // Name extraction benefits from line breaks if present
            extractedInfo.put("name", extractName(rawText));
            extractedInfo.put("email", extractEmail(text));
            extractedInfo.put("phone", extractPhone(text));
            extractedInfo.put("links", extractLinks(text));
            extractedInfo.put("skills", extractSkills(text));
            extractedInfo.put("education", extractEducation(text));
            extractedInfo.put("experience", extractExperience(text));
            extractedInfo.put("certifications", extractCertifications(text));
            extractedInfo.put("languages", extractLanguages(text));
        } catch (Exception e) {
            throw new IOException("Error parsing resume: " + e.getMessage(), e);
        }

        return extractedInfo;
    }

    private String extractName(String text) {
        // Assume name is at the top, often in larger font or standalone
        String[] lines = text.split("\n");
        for (String line : lines) {
            line = line.trim();
            if (line.isEmpty()) continue;
            // Basic name pattern: Two words, capitalized, not containing numbers or special chars
            if (line.matches("[A-Z][a-z]+\\s+[A-Z][a-z]+.*")) {
                return line;
            }
        }
        return "";
    }

    private String extractEmail(String text) {
        Pattern pattern = Pattern.compile("\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}\\b");
        Matcher matcher = pattern.matcher(text);
        return matcher.find() ? matcher.group().toLowerCase() : "";
    }

    private String extractPhone(String text) {
        // Enhanced phone regex to handle various formats
        Pattern pattern = Pattern.compile(
                "\\b\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}\\b|" +
                        "\\b\\+?\\d{1,3}[-.\\s]?\\d{3}[-.\\s]?\\d{3}[-.\\s]?\\d{4}\\b"
        );
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            String phone = matcher.group().replaceAll("[^0-9+]", "");
            return phone.startsWith("+") ? phone : "+1" + phone; // Normalize to include country code
        }
        return "";
    }

    private List<String> extractLinks(String text) {
        List<String> links = new ArrayList<>();
        Pattern pattern = Pattern.compile(
                "\\b(https?://)?(?:www\\.)?(linkedin\\.com/in/[A-Za-z0-9-]+|" +
                        "github\\.com/[A-Za-z0-9-]+|portfolio\\.[A-Za-z0-9.-]+|[A-Za-z0-9.-]+\\.[A-Za-z]{2,}/[A-Za-z0-9-]+)\\b"
        );
        Matcher matcher = pattern.matcher(text.toLowerCase());
        while (matcher.find()) {
            String link = matcher.group();
            if (!link.startsWith("http")) {
                link = "https://" + link;
            }
            links.add(link);
        }
        return links;
    }

    private Map<String, List<String>> extractSkills(String text) {
        Map<String, List<String>> categorizedSkills = new HashMap<>();
        String lowerText = text.toLowerCase();

        for (Map.Entry<String, List<String>> category : SKILL_CATEGORIES.entrySet()) {
            List<String> matchedSkills = new ArrayList<>();
            for (String skill : category.getValue()) {
                // Case-insensitive exact match or partial match with boundaries
                if (lowerText.contains(skill.toLowerCase()) ||
                        Pattern.compile("\\b" + Pattern.quote(skill.toLowerCase()) + "\\b").matcher(lowerText).find()) {
                    matchedSkills.add(skill);
                }
            }
            if (!matchedSkills.isEmpty()) {
                categorizedSkills.put(category.getKey(), matchedSkills);
            }
        }

        return categorizedSkills;
    }

    private List<Map<String, String>> extractEducation(String text) {
        List<Map<String, String>> educationList = new ArrayList<>();
        Pattern degreePattern = Pattern.compile(
                "(?i)(Bachelor|B\\.?[A-Za-z]*|Master|M\\.?[A-Za-z]*|PhD|Doctorate).*?(?=\\d{4}|,\\s[A-Z]|$)",
                Pattern.DOTALL
        );
        Pattern datePattern = Pattern.compile("\\b(19|20)\\d{2}\\s*[-–—]\\s*(19|20)?\\d{2}?\\b");
        Pattern institutionPattern = Pattern.compile(
                "(?i)(University|College|Institute|Academy|School).*?(?=\\d{4}|$)",
                Pattern.DOTALL
        );

        Matcher degreeMatcher = degreePattern.matcher(text);
        while (degreeMatcher.find()) {
            Map<String, String> education = new HashMap<>();
            String degreeText = degreeMatcher.group().trim();
            education.put("degree", degreeText);

            // Extract institution
            Matcher instMatcher = institutionPattern.matcher(text.substring(degreeMatcher.start()));
            if (instMatcher.find()) {
                education.put("institution", instMatcher.group().trim());
            } else {
                education.put("institution", "");
            }

            // Extract dates
            Matcher dateMatcher = datePattern.matcher(text.substring(degreeMatcher.start()));
            if (dateMatcher.find()) {
                education.put("dates", dateMatcher.group().trim());
            } else {
                education.put("dates", "");
            }

            educationList.add(education);
        }

        return educationList;
    }

    private List<Map<String, String>> extractExperience(String text) {
        List<Map<String, String>> experienceList = new ArrayList<>();
        Pattern jobPattern = Pattern.compile(
                "(?i)(Engineer|Developer|Manager|Director|Lead|Architect|Consultant|Analyst|Specialist).*?(?=\\d{4}|$)",
                Pattern.DOTALL
        );
        Pattern datePattern = Pattern.compile("\\b(19|20)\\d{2}\\s*[-–—]\\s*(19|20)?\\d{2}?\\b");
        Pattern companyPattern = Pattern.compile(
                "(?i)(Inc\\.|Corporation|Corp\\.|LLC|Group|Technologies|Systems|Labs|Solutions).*?(?=\\d{4}|$)",
                Pattern.DOTALL
        );

        Matcher jobMatcher = jobPattern.matcher(text);
        while (jobMatcher.find()) {
            Map<String, String> experience = new HashMap<>();
            String jobTitle = jobMatcher.group().trim();
            experience.put("title", jobTitle);

            // Extract company
            Matcher compMatcher = companyPattern.matcher(text.substring(jobMatcher.start()));
            if (compMatcher.find()) {
                experience.put("company", compMatcher.group().trim());
            } else {
                experience.put("company", "");
            }

            // Extract dates
            Matcher dateMatcher = datePattern.matcher(text.substring(jobMatcher.start()));
            if (dateMatcher.find()) {
                experience.put("dates", dateMatcher.group().trim());
            } else {
                experience.put("dates", "");
            }

            experienceList.add(experience);
        }

        return experienceList;
    }

    private List<String> extractCertifications(String text) {
        List<String> certifications = new ArrayList<>();
        Pattern pattern = Pattern.compile(
                "(?i)(Certified|Certification|C\\.?[A-Za-z]*).*?(?=\\d{4}|,\\s[A-Z]|$)",
                Pattern.DOTALL
        );
        Matcher matcher = pattern.matcher(text);
        while (matcher.find()) {
            certifications.add(matcher.group().trim());
        }
        return certifications;
    }

    private List<String> extractLanguages(String text) {
        List<String> languages = new ArrayList<>();
        String[] commonLanguages = {
                "English", "Spanish", "French", "German", "Chinese", "Mandarin",
                "Hindi", "Arabic", "Portuguese", "Russian", "Japanese"
        };
        String lowerText = text.toLowerCase();
        for (String lang : commonLanguages) {
            if (lowerText.contains(lang.toLowerCase())) {
                languages.add(lang);
            }
        }
        return languages;
    }
}