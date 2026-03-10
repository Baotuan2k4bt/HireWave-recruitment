package com.example.hirewave.api;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/career")
public class CareerAPI {

    private final RestTemplate restTemplate = new RestTemplate();

    private String callDevTo(String url) {
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.ACCEPT, "application/json");
        headers.set(HttpHeaders.USER_AGENT, "HireWave/1.0 (Spring Boot)");

        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<String> res = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        return res.getBody();
    }

    private int normalizePage(int page) {
        return page < 1 ? 1 : page;
    }

    private int normalizeSize(int size) {
        if (size < 1) return 12;
        if (size > 30) return 30;
        return size;
    }

    // ---------- INTERVIEW ARTICLES ----------

    @GetMapping("/interview")
    public ResponseEntity<?> interview(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        try {
            page = normalizePage(page);
            size = normalizeSize(size);

            String url = "https://dev.to/api/articles?tag=interview&per_page=" + size + "&page=" + page;
            return ResponseEntity.ok(callDevTo(url));

        } catch (HttpServerErrorException e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body("{\"error\":\"Dev.to is temporarily unavailable\"}");

        } catch (HttpClientErrorException e) {
            // ví dụ 404/429...
            return ResponseEntity.status(e.getStatusCode())
                    .body(e.getResponseBodyAsString());

        } catch (ResourceAccessException e) {
            return ResponseEntity.status(HttpStatus.GATEWAY_TIMEOUT)
                    .body("{\"error\":\"Dev.to timeout or network error\"}");
        }
    }

    @GetMapping("/interview/{id}")
    public ResponseEntity<?> interviewDetail(@PathVariable long id) {
        try {
            String url = "https://dev.to/api/articles/" + id;
            return ResponseEntity.ok(callDevTo(url));

        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(e.getResponseBodyAsString());

        } catch (HttpServerErrorException e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body("{\"error\":\"Dev.to is temporarily unavailable\"}");

        } catch (ResourceAccessException e) {
            return ResponseEntity.status(HttpStatus.GATEWAY_TIMEOUT)
                    .body("{\"error\":\"Dev.to timeout or network error\"}");
        }
    }

    // ---------- JOB NEWS & CAREER TIPS ----------

    @GetMapping("/news")
    public ResponseEntity<?> jobNews(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        try {
            page = normalizePage(page);
            size = normalizeSize(size);

            // Tin tức việc làm chung chung: dùng tag "career" trên dev.to
            String url = "https://dev.to/api/articles?tag=career&per_page=" + size + "&page=" + page;
            return ResponseEntity.ok(callDevTo(url));

        } catch (HttpServerErrorException e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body("{\"error\":\"Dev.to is temporarily unavailable\"}");

        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(e.getResponseBodyAsString());

        } catch (ResourceAccessException e) {
            return ResponseEntity.status(HttpStatus.GATEWAY_TIMEOUT)
                    .body("{\"error\":\"Dev.to timeout or network error\"}");
        }
    }

    @GetMapping("/tips")
    public ResponseEntity<?> jobTips(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        try {
            page = normalizePage(page);
            size = normalizeSize(size);

            // Bí kíp việc làm: dùng tag "career-advice" trên dev.to
            String url = "https://dev.to/api/articles?tag=career-advice&per_page=" + size + "&page=" + page;
            return ResponseEntity.ok(callDevTo(url));

        } catch (HttpServerErrorException e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body("{\"error\":\"Dev.to is temporarily unavailable\"}");

        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(e.getResponseBodyAsString());

        } catch (ResourceAccessException e) {
            return ResponseEntity.status(HttpStatus.GATEWAY_TIMEOUT)
                    .body("{\"error\":\"Dev.to timeout or network error\"}");
        }
    }
}