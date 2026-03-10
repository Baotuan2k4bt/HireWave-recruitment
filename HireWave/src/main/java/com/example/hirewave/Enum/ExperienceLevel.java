package com.example.hirewave.Enum;

/**
 * Experience level enum for job requirements and candidate matching
 */
public enum ExperienceLevel {
    JUNIOR(0, 2),      // 0-2 years
    MID(2, 5),        // 2-5 years
    SENIOR(5, 10),    // 5-10 years
    LEAD(10, Integer.MAX_VALUE); // 10+ years

    private final int minYears;
    private final int maxYears;

    ExperienceLevel(int minYears, int maxYears) {
        this.minYears = minYears;
        this.maxYears = maxYears;
    }

    public int getMinYears() {
        return minYears;
    }

    public int getMaxYears() {
        return maxYears;
    }

    /**
     * Get experience level from years of experience
     */
    public static ExperienceLevel fromYears(Integer years) {
        if (years == null) {
            return JUNIOR;
        }
        for (ExperienceLevel level : values()) {
            if (years >= level.minYears && years < level.maxYears) {
                return level;
            }
        }
        return LEAD;
    }

    /**
     * Check if candidate experience matches job requirement
     */
    public boolean matches(ExperienceLevel candidateLevel) {
        return candidateLevel.ordinal() >= this.ordinal();
    }
}
