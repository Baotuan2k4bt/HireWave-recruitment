package com.example.hirewave.api;

import com.example.hirewave.dto.JobDTO;
import com.example.hirewave.dto.UserDTO;
import com.example.hirewave.exception.HireWaveException;
import com.example.hirewave.service.AdminService;
import com.example.hirewave.service.JobService;
import com.example.hirewave.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAPI {
    @Autowired
    private UserService userService;

    @Autowired
    private JobService jobService;

    @Autowired
    private AdminService adminService;


    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() throws HireWaveException {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobDTO>> getAllJobs() {
        try {
            // Admin get all jobs - no userId needed (hasApplied will be false)
            List<JobDTO> jobs = jobService.getAllJobs(null);
            return ResponseEntity.ok(jobs);
        } catch (HireWaveException e) {
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @GetMapping("/employers/pending")
    public ResponseEntity<List<UserDTO>> getPendingEmployers() {
        List<UserDTO> pendingEmployers = adminService.getPendingEmployers()
                .stream()
                .map(user -> user.toDTO())
                .toList();
        return ResponseEntity.ok(pendingEmployers);
    }

    @PostMapping("/employers/{id}/approve")
    public ResponseEntity<String> approveEmployer(@PathVariable Long id) throws HireWaveException {
        adminService.approveEmployer(id);
        return ResponseEntity.ok("Employer approved successfully");
    }

    @PostMapping("/employers/{id}/reject")
    public ResponseEntity<String> rejectEmployer(@PathVariable Long id) throws HireWaveException {
        adminService.rejectEmployer(id);
        return ResponseEntity.ok("Employer rejected successfully");
    }

    @PostMapping("/users/{id}/status/{AccountStatus}")
    public ResponseEntity<String> changeAccountStatus(
            @PathVariable Long id,
            @PathVariable String AccountStatus) throws HireWaveException {
        userService.changeAccountStatus(id, AccountStatus);
        return ResponseEntity.ok("Account status changed successfully");
    }
    @GetMapping("/jobs/pending")
    public ResponseEntity<List<JobDTO>> getPendingJobs() {
        try {
            List<JobDTO> pendingJobs = jobService.getPendingJobs();
            return ResponseEntity.ok(pendingJobs);
        } catch (HireWaveException e) {
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @PostMapping("/jobs/{id}/approve")
    public ResponseEntity<String> approveJob(@PathVariable Long id) throws HireWaveException {
        jobService.approveJob(id);
        return ResponseEntity.ok("Job approved successfully");
    }

    @PostMapping("/jobs/{id}/reject")
    public ResponseEntity<String> rejectJob(@PathVariable Long id) throws HireWaveException {
        jobService.rejectJob(id);
        return ResponseEntity.ok("Job rejected successfully");
    }
}