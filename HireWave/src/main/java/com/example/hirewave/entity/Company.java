package com.example.hirewave.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "companies", indexes = {
    @Index(name = "idx_company_name", columnList = "name")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String logoUrl;

    private String website;

    private String location;

    private String industry; // Ngành nghề (e.g., IT, Finance)

    private String companySize; // Quy mô (e.g., 50-100 employees)

    @Column(length = 5000)
    private String description;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Job> jobs;

    // ID của User (Recruiter) sở hữu/quản lý công ty này
    @Column(name = "owner_id")
    private Long ownerId;
}