package com.example.hirewave.service;

import com.example.hirewave.entity.User;
import com.example.hirewave.exception.HireWaveException;

import java.util.List;

public interface AdminService {
    List<User> getPendingEmployers();
    void approveEmployer(Long id) throws HireWaveException;
    void rejectEmployer(Long id) throws HireWaveException;
//    void approveJob(Long id) throws HiringWireException;
//    List<Job> getPendingJobs();
}