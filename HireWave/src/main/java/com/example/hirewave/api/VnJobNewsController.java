package com.example.hirewave.api;

import com.example.hirewave.dto.VnJobNewsDTO;
import com.example.hirewave.dto.PagedResponse;
import com.example.hirewave.service.VnJobNewsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/career")
public class VnJobNewsController {

    private final VnJobNewsService vnJobNewsService;


    public VnJobNewsController(VnJobNewsService vnJobNewsService) {
        this.vnJobNewsService = vnJobNewsService;
    }

    @GetMapping("/vn-news")
    public ResponseEntity<PagedResponse<VnJobNewsDTO>> vnNews(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        if (page < 1) page = 1;
        if (size < 1) size = 12;
        if (size > 30) size = 30;

        List<VnJobNewsDTO> all = vnJobNewsService.fetchVnExpressJobNews();

        int from = (page - 1) * size;
        int to = Math.min(from + size, all.size());
        List<VnJobNewsDTO> items = (from >= all.size()) ? List.of() : all.subList(from, to);

        boolean hasMore = to < all.size();

        return ResponseEntity.ok(new PagedResponse<>(page, size, hasMore, items));
    }

    /**
     * Bí kíp việc làm tiếng Việt: lọc các bài có nội dung thiên về kinh nghiệm / tips
     * từ cùng nguồn RSS việc làm của VnExpress.
     */
    @GetMapping("/vn-tips")
    public ResponseEntity<PagedResponse<VnJobNewsDTO>> vnTips(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        if (page < 1) page = 1;
        if (size < 1) size = 12;
        if (size > 30) size = 30;

        List<VnJobNewsDTO> all = vnJobNewsService.fetchVnExpressTips();

        int from = (page - 1) * size;
        int to = Math.min(from + size, all.size());
        List<VnJobNewsDTO> items = (from >= all.size()) ? List.of() : all.subList(from, to);

        boolean hasMore = to < all.size();
        return ResponseEntity.ok(new PagedResponse<>(page, size, hasMore, items));
    }
}