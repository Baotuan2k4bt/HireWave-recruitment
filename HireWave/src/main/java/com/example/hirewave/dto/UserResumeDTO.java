package com.example.hirewave.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResumeDTO {
    private Long id;
    private String title;
    private String originalFilename;
    private String mimeType;
    private Long size;
    private Instant createdAt;

    /**
     * Đánh dấu CV đang là mặc định cho user.
     */
    private boolean isDefault;

    // URL FE dùng để xem file
    private String fileUrl;
}
