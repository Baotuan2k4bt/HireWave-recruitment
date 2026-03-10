package com.example.hirewave.repository;
import com.example.hirewave.entity.OTP;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface IOTPRepository extends JpaRepository<OTP, String> {
	List<OTP> findByCreationTimeBefore(LocalDateTime expiryTime);
}