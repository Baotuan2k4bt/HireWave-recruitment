package com.example.hirewave.service;

import com.example.hirewave.dto.UserResumeDTO;
import com.example.hirewave.entity.UserResume;
import com.example.hirewave.exception.HireWaveException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IUserResumeService {
    UserResumeDTO upload(MultipartFile file, String title, Long userId) throws HireWaveException;
    List<UserResumeDTO> getMyCvs(Long userId) throws HireWaveException;

    /**
     * Lấy đầy đủ entity CV đã được kiểm tra quyền sở hữu.
     * Giúp tránh việc truy vấn lặp lại khi cần nhiều thông tin khác nhau của cùng một CV.
     */
    UserResume getOwnedCv(Long cvId, Long userId) throws HireWaveException;

    byte[] getCvFile(Long cvId, Long userId) throws HireWaveException;
    String getCvMimeType(Long cvId, Long userId) throws HireWaveException;
    String getCvFilename(Long cvId, Long userId) throws HireWaveException;
    void deleteCv(Long cvId, Long userId) throws HireWaveException;

    /**
     * Đặt một CV làm mặc định cho user.
     * Trả về DTO đã cập nhật trạng thái isDefault.
     */
    UserResumeDTO setDefault(Long cvId, Long userId) throws HireWaveException;
}
