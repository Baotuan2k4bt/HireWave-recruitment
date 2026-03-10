package com.example.hirewave.service;

import com.example.hirewave.dto.UserResumeDTO;
import com.example.hirewave.entity.UserResume;
import com.example.hirewave.exception.HireWaveException;
import com.example.hirewave.repository.UserResumeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
@Service
@Transactional
public class UserResumeService implements IUserResumeService{
    private static final long MAX_SIZE_BYTES = 5L * 1024 * 1024; // 5MB
    private static final String PDF_MIME = "application/pdf";

    private final UserResumeRepository repo;

    public UserResumeService(UserResumeRepository repo) {
        this.repo = repo;
    }

    @Override
    public UserResumeDTO upload(MultipartFile file, String title, Long userId) throws HireWaveException {
        if (file == null || file.isEmpty()) throw new HireWaveException("File is required");
        if (file.getSize() > MAX_SIZE_BYTES) throw new HireWaveException("File too large (max 5MB)");

        String mimeType = file.getContentType() == null ? "application/octet-stream" : file.getContentType();
        if (!PDF_MIME.equals(mimeType)) throw new HireWaveException("Only PDF is supported for preview");

        String original = file.getOriginalFilename() == null ? "resume.pdf" : file.getOriginalFilename();
        String safeTitle = (title == null || title.isBlank()) ? original : title.trim();

        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (Exception e) {
            throw new HireWaveException("Cannot read file bytes");
        }

        UserResume ur = new UserResume();
        ur.setUserId(userId);
        ur.setTitle(safeTitle);
        ur.setOriginalFilename(original);
        ur.setMimeType(mimeType);
        ur.setSize(file.getSize());
        ur.setContent(bytes);

        UserResume saved = repo.save(ur);

        return new UserResumeDTO(
                saved.getId(),
                saved.getTitle(),
                saved.getOriginalFilename(),
                saved.getMimeType(),
                saved.getSize(),
                saved.getCreatedAt(),
                saved.isDefault(),
                "/cv/file/" + saved.getId()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResumeDTO> getMyCvs(Long userId) throws HireWaveException {
        return repo.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(r -> new UserResumeDTO(
                        r.getId(),
                        r.getTitle(),
                        r.getOriginalFilename(),
                        r.getMimeType(),
                        r.getSize(),
                        r.getCreatedAt(),
                        r.isDefault(),
                        "/cv/file/" + r.getId()
                ))
                .toList();
    }
    private UserResume mustFindOwned(Long cvId, Long userId) throws HireWaveException {
        return repo.findByIdAndUserId(cvId, userId)
                .orElseThrow(() -> new HireWaveException("CV not found"));
    }

    /**
     * Trả về entity CV sau khi đã kiểm tra quyền sở hữu.
     * Dùng cho các luồng cần nhiều thông tin từ cùng một CV (ví dụ: nội dung, mimeType, filename)
     * để tránh truy vấn DB lặp lại.
     */
    @Override
    @Transactional(readOnly = true)
    public UserResume getOwnedCv(Long cvId, Long userId) throws HireWaveException {
        return mustFindOwned(cvId, userId);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] getCvFile(Long cvId, Long userId) throws HireWaveException {
        // giữ nguyên để tương thích interface cũ, mặc dù hiện tại controller đã dùng phương án tối ưu hơn
        return mustFindOwned(cvId, userId).getContent();
    }

    @Override
    @Transactional(readOnly = true)
    public String getCvMimeType(Long cvId, Long userId) throws HireWaveException {
        return mustFindOwned(cvId, userId).getMimeType();
    }

    @Override
    @Transactional(readOnly = true)
    public String getCvFilename(Long cvId, Long userId) throws HireWaveException {
        return mustFindOwned(cvId, userId).getOriginalFilename();
    }

    @Override
    public void deleteCv(Long cvId, Long userId) throws HireWaveException {
        UserResume r = mustFindOwned(cvId, userId);
        repo.delete(r);
    }

    /**
     * Đặt một CV làm mặc định cho user:
     * - Chỉ CV thuộc về user hiện tại mới được phép.
     * - Tất cả CV khác của user sẽ có isDefault=false.
     */
    @Override
    public UserResumeDTO setDefault(Long cvId, Long userId) throws HireWaveException {
        // Lấy tất cả CV của user
        var all = repo.findByUserIdOrderByCreatedAtDesc(userId);

        if (all.isEmpty()) {
            throw new HireWaveException("No CVs found for user");
        }

        UserResume target = null;
        for (UserResume r : all) {
            if (r.getId().equals(cvId)) {
                target = r;
                r.setDefault(true);
            } else {
                r.setDefault(false);
            }
        }

        if (target == null) {
            // Nếu không tìm thấy CV tương ứng với id trong danh sách của user
            throw new HireWaveException("CV not found");
        }

        repo.saveAll(all);

        return new UserResumeDTO(
                target.getId(),
                target.getTitle(),
                target.getOriginalFilename(),
                target.getMimeType(),
                target.getSize(),
                target.getCreatedAt(),
                target.isDefault(),
                "/cv/file/" + target.getId()
        );
    }
}
