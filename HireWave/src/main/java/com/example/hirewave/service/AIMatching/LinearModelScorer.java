package com.example.hirewave.service.AIMatching;

import com.example.hirewave.dto.AIMatching.MatchingFeatures;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.Map;

@Service
public class LinearModelScorer implements MatchingScorer {

    private final Map<String, Double> weights;

    public LinearModelScorer(ObjectMapper mapper) throws Exception {
        InputStream is = getClass()
                .getClassLoader()
                .getResourceAsStream("model-weights.json");

        if (is == null) {
            throw new IllegalStateException("model-weights.json not found in resources");
        }

        this.weights = mapper.readValue(is, Map.class);
    }

    @Override
    public double score(MatchingFeatures f) {

        double z =
                getWeight("bias")
                        + getWeight("skillRatio") * f.getSkillRatio()
                        + getWeight("skillCosine") * f.getSkillCosine()
                        + getWeight("expRatio") * f.getExpRatio()
                        + getWeight("titleSimilarity") * f.getTitleSimilarity()
                        + getWeight("keywordDensity") * f.getKeywordDensity();

        return round(sigmoid(z) * 100);
    }

    private double getWeight(String key) {
        return weights.getOrDefault(key, 0.0);
    }

    private double sigmoid(double x) {
        return 1.0 / (1.0 + Math.exp(-x));
    }

    private double round(double v) {
        return Math.round(v * 100.0) / 100.0;
    }

}
