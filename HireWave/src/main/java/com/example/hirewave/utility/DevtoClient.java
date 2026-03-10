package com.example.hirewave.utility;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class DevtoClient {

    private final RestTemplate restTemplate;

    public DevtoClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String fetchArticlesByTag(String tag, int page, int size) {
        String url = "https://dev.to/api/articles?tag=" + tag + "&per_page=" + size + "&page=" + page;
        return restTemplate.getForObject(url, String.class);
    }

    public String fetchArticleDetail(long id) {
        String url = "https://dev.to/api/articles/" + id;
        return restTemplate.getForObject(url, String.class);
    }
}