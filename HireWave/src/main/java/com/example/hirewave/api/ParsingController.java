package com.example.hirewave.api;

import com.example.hirewave.scoreCV.ParsingResult;
import com.example.hirewave.scoreCV.ParsingResultV2;
import com.example.hirewave.service.ResumeParser;
import com.example.hirewave.service.scoreCVService.ParsingScorerServiceImpl;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/candidate-ai/parsing")
@RequiredArgsConstructor
public class ParsingController {

    private final ParsingScorerServiceImpl parsingScorer;
    private final ResumeParser resumeParser;

    /**
     * Evaluate CV from extracted text
     */
    @PostMapping("/evaluate-text")
    public ResponseEntity<ParsingResult> evaluateText(@RequestBody String extractedText) {
        ParsingResult result = parsingScorer.score(extractedText);
        return ResponseEntity.ok(result);
    }

    /**
     * Evaluate CV from PDF file (returns V2 result with enhanced analysis)
     * Accepts base64 encoded PDF or multipart file
     */
    @PostMapping("/evaluate-pdf")
    public ResponseEntity<Map<String, Object>> evaluatePdf(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "base64", required = false) String base64Pdf
    ) {
        Map<String, Object> response = new HashMap<>();

        try {
            byte[] pdfData = null;

            // Get PDF data from either file or base64
            if (file != null && !file.isEmpty()) {
                pdfData = file.getBytes();
            } else if (base64Pdf != null && !base64Pdf.isEmpty()) {
                // Remove data URL prefix if present
                String base64 = base64Pdf;
                if (base64Pdf.contains(",")) {
                    base64 = base64Pdf.substring(base64Pdf.indexOf(",") + 1);
                }
                pdfData = Base64.getDecoder().decode(base64);
            } else {
                response.put("error", "No PDF file or base64 data provided");
                return ResponseEntity.badRequest().body(response);
            }

            // Parse resume to extract text
            Map<String, Object> parsedInfo = resumeParser.parseResume(pdfData);
            String extractedText = extractTextFromPdf(pdfData);

            // Score the CV using V2 (enhanced ATS Simulator)
            ParsingResultV2 scoreResult = parsingScorer.scoreV2(extractedText);

            // Combine parsed info and enhanced score result
            response.put("score", scoreResult.getScore());
            response.put("levelLabel", scoreResult.getLevelLabel());
            response.put("verdict", scoreResult.getVerdict());
            response.put("issues", scoreResult.getIssues());
            response.put("suggestions", scoreResult.getSuggestions());
            response.put("strengths", scoreResult.getStrengths());
            response.put("weaknesses", scoreResult.getWeaknesses());
            response.put("breakdown", scoreResult.getBreakdown());
            response.put("uiHints", scoreResult.getUiHints());
            response.put("parsedInfo", parsedInfo);
            response.put("extractedText", extractedText);

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            response.put("error", "Failed to process PDF: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("error", "Unexpected error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * Evaluate CV from text (returns V2 result)
     */
    @PostMapping("/evaluate-text-v2")
    public ResponseEntity<ParsingResultV2> evaluateTextV2(@RequestBody String extractedText) {
        ParsingResultV2 result = parsingScorer.scoreV2(extractedText);
        return ResponseEntity.ok(result);
    }

    /**
     * Extract plain text from PDF
     */
    private String extractTextFromPdf(byte[] pdfData) throws IOException {
        try (PDDocument document = PDDocument.load(new ByteArrayInputStream(pdfData))) {
            if (document.isEncrypted()) {
                throw new IOException("Cannot parse encrypted PDF");
            }
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document).replaceAll("\\s+", " ").trim();
        }
    }
}