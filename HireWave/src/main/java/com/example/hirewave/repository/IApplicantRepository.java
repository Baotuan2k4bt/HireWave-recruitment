package com.example.hirewave.repository;

import com.example.hirewave.entity.Applicant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IApplicantRepository extends JpaRepository<Applicant, Long> {

    /**
     * Tìm tất cả ứng viên của một công việc cụ thể
     */
    List<Applicant> findByJobId(Long jobId);

    /**
     * Tìm ứng viên của một công việc, sắp xếp theo thời gian nộp đơn mới nhất
     */
    List<Applicant> findByJobIdOrderByTimestampDesc(Long jobId);

    /**
     * Lấy tất cả ứng viên, sắp xếp theo thời gian nộp đơn mới nhất
     */
    List<Applicant> findAllByOrderByTimestampDesc();

    /**
     * Kiểm tra xem một người dùng đã nộp đơn vào một công việc chưa
     */
    boolean existsByApplicantIdAndJobId(Long applicantId, Long jobId);
}
