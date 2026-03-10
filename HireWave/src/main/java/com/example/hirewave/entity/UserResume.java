package com.example.hirewave.entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        name = "user_resumes",
        indexes = {
                @Index(name = "idx_user_resumes_user_id", columnList = "user_id")
        }
)
public class UserResume {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="user_id", nullable = false)
    private Long userId;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name="original_filename", nullable = false, length = 512)
    private String originalFilename;

    @Column(name="mime_type", nullable = false, length = 100)
    private String mimeType;

    @Column(nullable = false)
    private Long size;

    @Column(name = "is_default", nullable = false)
    private boolean isDefault = false;

    @Lob
    @Column(name="content", nullable = false, columnDefinition = "LONGBLOB")
    private byte[] content;

    @Column(name="created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void prePersist() {
        createdAt = Instant.now(); }

}