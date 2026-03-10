package com.example.hirewave.utility;

import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Utility class for normalizing and processing skills
 */
@Component
public class SkillNormalizer {

    /**
     * Normalize a single skill: lowercase, trim, remove duplicates
     */
    public String normalize(String skill) {
        if (skill == null || skill.isBlank()) {
            return null;
        }
        return skill.trim().toLowerCase();
    }

    /**
     * Normalize a list of skills: lowercase, trim, remove duplicates and nulls
     */
    public static List<String> normalizeList(List<String> skills) {
        if (skills == null) return List.of();

        return skills.stream()
                .filter(Objects::nonNull)
                .map(s -> s.trim().toLowerCase())
                .distinct()
                .collect(Collectors.toList());
    }
    /**
     * Find matched skills between candidate and job requirements
     */
    public static List<String> findMatchedSkills(List<String> candidateSkills, List<String> jobSkills) {
        if (candidateSkills == null || jobSkills == null) {
            return new ArrayList<>();
        }
        List<String> normalizedCandidate = normalizeList(candidateSkills);
        List<String> normalizedJob = normalizeList(jobSkills);
        Set<String> jobSet = new HashSet<>(normalizedJob);
        return normalizedCandidate.stream()
                .filter(jobSet::contains)
                .collect(Collectors.toList());
    }

    /**
     * Find missing skills (skills required by job but not in candidate profile)
     */
    public static List<String> findMissingSkills(List<String> candidateSkills, List<String> jobSkills) {
        if (jobSkills == null) {
            return new ArrayList<>();
        }
        if (candidateSkills == null) {
            return normalizeList(jobSkills);
        }
        List<String> normalizedCandidate = normalizeList(candidateSkills);
        List<String> normalizedJob = normalizeList(jobSkills);
        Set<String> candidateSet = new HashSet<>(normalizedCandidate);
        return normalizedJob.stream()
                .filter(skill -> !candidateSet.contains(skill))
                .collect(Collectors.toList());
    }

    /**
     * Calculate skill matching percentage
     */
    public double calculateSkillMatchPercentage(List<String> candidateSkills, List<String> jobSkills) {
        if (jobSkills == null || jobSkills.isEmpty()) {
            return 0.0;
        }
        List<String> matched = findMatchedSkills(candidateSkills, jobSkills);
        return (double) matched.size() / jobSkills.size() * 100.0;
    }
}
