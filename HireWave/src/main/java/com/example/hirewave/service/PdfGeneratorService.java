package com.example.hirewave.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.action.PdfAction;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Link;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;

@Service
public class PdfGeneratorService {

    @SuppressWarnings("unchecked")
    public byte[] generateExtractedPdf(Map<String, Object> parsedInfo) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Set PDF metadata
            pdf.getDocumentInfo().setTitle("Extracted Resume Information");
            pdf.getDocumentInfo().setAuthor("HiringWire Resume Parser");
            pdf.getDocumentInfo().setCreator("HiringWire");

            // Add header
            Paragraph header = new Paragraph("Extracted Resume Information")
                    .setFontSize(16)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
            document.add(header);

            // Add name if present
            String name = (String) parsedInfo.getOrDefault("name", "");
            if (!name.isEmpty()) {
                document.add(new Paragraph("Candidate Name: " + name)
                        .setFontSize(12)
                        .setBold()
                        .setMarginBottom(10));
            }

            // Add contact info section
            document.add(new Paragraph("Contact Information")
                    .setFontSize(12)
                    .setBold()
                    .setMarginTop(10));
            document.add(new Paragraph("Email: " + parsedInfo.getOrDefault("email", "Not found"))
                    .setFontSize(10));
            document.add(new Paragraph("Phone: " + parsedInfo.getOrDefault("phone", "Not found"))
                    .setFontSize(10));

            // Add links
            List<String> links = (List<String>) parsedInfo.getOrDefault("links", List.of());
            if (!links.isEmpty()) {
                document.add(new Paragraph("Links:")
                        .setFontSize(10)
                        .setMarginTop(5));
                for (String link : links) {
                    Link linkElement = new Link(link, PdfAction.createURI(link));
//                    Link linkElement = new Link(link, new com.itextpdf.kernel.pdf.action.PdfAction());
                    document.add(new Paragraph("• ").add(linkElement)
                            .setFontSize(10));
                }
            }

            // Add skills section (categorized)
            Map<String, List<String>> skills = (Map<String, List<String>>) parsedInfo.getOrDefault("skills", Map.of());
            if (!skills.isEmpty()) {
                document.add(new Paragraph("Skills")
                        .setFontSize(12)
                        .setBold()
                        .setMarginTop(20));

                for (Map.Entry<String, List<String>> category : skills.entrySet()) {
                    document.add(new Paragraph(category.getKey() + ":")
                            .setFontSize(10)
                            .setItalic()
                            .setMarginLeft(10)
                            .setMarginTop(5));
                    for (String skill : category.getValue()) {
                        document.add(new Paragraph("• " + skill)
                                .setFontSize(10)
                                .setMarginLeft(20));
                    }
                }
            }

            // Add education section
            List<Map<String, String>> education = (List<Map<String, String>>) parsedInfo.getOrDefault("education", List.of());
            if (!education.isEmpty()) {
                document.add(new Paragraph("Education")
                        .setFontSize(12)
                        .setBold()
                        .setMarginTop(20));

                Table table = new Table(UnitValue.createPercentArray(new float[]{40, 40, 20}))
                        .useAllAvailableWidth();
                table.addHeaderCell(new Cell().add(new Paragraph("Degree").setBold()));
                table.addHeaderCell(new Cell().add(new Paragraph("Institution").setBold()));
                table.addHeaderCell(new Cell().add(new Paragraph("Dates").setBold()));

                for (Map<String, String> edu : education) {
                    table.addCell(new Cell().add(new Paragraph(edu.getOrDefault("degree", ""))));
                    table.addCell(new Cell().add(new Paragraph(edu.getOrDefault("institution", ""))));
                    table.addCell(new Cell().add(new Paragraph(edu.getOrDefault("dates", ""))));
                }
                document.add(table);
            }

            // Add experience section
            List<Map<String, String>> experience = (List<Map<String, String>>) parsedInfo.getOrDefault("experience", List.of());
            if (!experience.isEmpty()) {
                document.add(new Paragraph("Experience")
                        .setFontSize(12)
                        .setBold()
                        .setMarginTop(20));

                Table table = new Table(UnitValue.createPercentArray(new float[]{30, 40, 30}))
                        .useAllAvailableWidth();
                table.addHeaderCell(new Cell().add(new Paragraph("Title").setBold()));
                table.addHeaderCell(new Cell().add(new Paragraph("Company").setBold()));
                table.addHeaderCell(new Cell().add(new Paragraph("Dates").setBold()));

                for (Map<String, String> exp : experience) {
                    table.addCell(new Cell().add(new Paragraph(exp.getOrDefault("title", ""))));
                    table.addCell(new Cell().add(new Paragraph(exp.getOrDefault("company", ""))));
                    table.addCell(new Cell().add(new Paragraph(exp.getOrDefault("dates", ""))));
                }
                document.add(table);
            }

            // Add certifications
            List<String> certifications = (List<String>) parsedInfo.getOrDefault("certifications", List.of());
            if (!certifications.isEmpty()) {
                document.add(new Paragraph("Certifications")
                        .setFontSize(12)
                        .setBold()
                        .setMarginTop(20));
                for (String cert : certifications) {
                    document.add(new Paragraph("• " + cert)
                            .setFontSize(10));
                }
            }

            // Add languages
            List<String> languages = (List<String>) parsedInfo.getOrDefault("languages", List.of());
            if (!languages.isEmpty()) {
                document.add(new Paragraph("Languages")
                        .setFontSize(12)
                        .setBold()
                        .setMarginTop(20));
                for (String lang : languages) {
                    document.add(new Paragraph("• " + lang)
                            .setFontSize(10));
                }
            }

            // Add footer
            PdfCanvas canvas = new PdfCanvas(pdf.getLastPage());
            canvas.beginText()
                    .setFontAndSize(com.itextpdf.kernel.font.PdfFontFactory.createFont(), 8)
                    .moveText(36, 20)
                    .showText("Generated by HiringWire Resume Parser")
                    .endText();

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            return new byte[0];
        }
    }
}