package com.example.hirewave.repository;

import com.example.hirewave.entity.UserResume;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserResumeRepository extends JpaRepository<UserResume, Long> {
    List<UserResume> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<UserResume> findByIdAndUserId(Long id, Long userId);
    Optional<UserResume> findByUserIdAndIsDefaultTrue(Long userId);

}
