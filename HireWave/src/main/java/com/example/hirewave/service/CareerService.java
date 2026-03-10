package com.example.hirewave.service;

import com.example.hirewave.utility.DevtoClient;
import org.springframework.stereotype.Service;

@Service
public class CareerService {

    private final DevtoClient devtoClient;

    public CareerService(DevtoClient devtoClient) {
        this.devtoClient = devtoClient;
    }

    public String getInterviewArticles(int page, int size) {
        // rule cho đồ án: giới hạn size để tránh spam API
        if (page < 1) page = 1;
        if (size < 1) size = 12;
        if (size > 30) size = 30;

        return devtoClient.fetchArticlesByTag("interview", page, size);
    }

    public String getInterviewDetail(long id) {
        return devtoClient.fetchArticleDetail(id);
    }
}