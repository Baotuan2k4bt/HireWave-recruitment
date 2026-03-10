package com.example.hirewave.dto;

import java.util.List;

public record PagedResponse<T>(
        int page,
        int size,
        boolean hasMore,
        List<T> items) {
}
