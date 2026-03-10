package com.example.hirewave.api;

import com.example.hirewave.dto.ResponseDTO;
import com.example.hirewave.dto.UserResumeDTO;
import com.example.hirewave.entity.UserResume;
import com.example.hirewave.exception.HireWaveException;
import com.example.hirewave.service.IUserResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/cv")
@Validated
public class UserResumeAPI {
    @Autowired
    private IUserResumeService userResumeService;
    private Long getCurrentUserId() throws HireWaveException {
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof com.example.hirewave.jwt.CustomUserDetails userDetails) {
            return userDetails.getId(); // ✅ đúng theo CustomUserDetails của bạn
        }
        throw new HireWaveException("Unauthenticated");
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserResumeDTO> uploadCv(
            @RequestPart("file") MultipartFile file,
            @RequestPart(value = "title", required = false) String title
    ) throws HireWaveException {
        Long userId = getCurrentUserId();
        return new ResponseEntity<>(userResumeService.upload(file, title, userId), HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<List<UserResumeDTO>> myCvs() throws HireWaveException {
        Long userId = getCurrentUserId();
        return new ResponseEntity<>(userResumeService.getMyCvs(userId), HttpStatus.OK);
    }

    @GetMapping("/file/{id}")
    public ResponseEntity<byte[]> viewCv(@PathVariable Long id) throws HireWaveException {
        Long userId = getCurrentUserId();

        // Lấy một lần đầy đủ thông tin CV để tránh truy vấn DB lặp lại
        UserResume cv = userResumeService.getOwnedCv(id, userId);
        byte[] bytes = cv.getContent();
        String mimeType = cv.getMimeType();
        String filename = cv.getOriginalFilename();

        String encoded = URLEncoder.encode(filename, StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename*=UTF-8''" + encoded)
                .contentType(MediaType.parseMediaType(mimeType))
                .body(bytes);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseDTO> deleteCv(@PathVariable Long id) throws HireWaveException {
        Long userId = getCurrentUserId();
        userResumeService.deleteCv(id, userId);
        return new ResponseEntity<>(new ResponseDTO("Delete Successfully"), HttpStatus.OK);
    }

    @PutMapping("/{id}/default")
    public ResponseEntity<UserResumeDTO> setDefault(@PathVariable Long id) throws HireWaveException {
        Long userId = getCurrentUserId();
        UserResumeDTO dto = userResumeService.setDefault(id, userId);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }


}
