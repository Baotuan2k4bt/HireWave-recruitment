package com.example.hirewave.dto;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class Certification {
	private String name;
    private String issuer;
    private LocalDateTime issueDate;
    private String certificateId;
}
