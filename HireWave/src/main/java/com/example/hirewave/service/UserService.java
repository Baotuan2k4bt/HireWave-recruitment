package com.example.hirewave.service;

import com.example.hirewave.dto.LoginDTO;
import com.example.hirewave.dto.ResponseDTO;
import com.example.hirewave.dto.UserDTO;
import com.example.hirewave.exception.HireWaveException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {

    UserDTO registerUser(UserDTO userDTO) throws HireWaveException;

    UserDTO getUserByEmail(String email) throws HireWaveException;

    UserDTO loginUser(LoginDTO loginDTO) throws HireWaveException;

    Boolean sendOTP(String email) throws HireWaveException;

    Boolean verifyOtp(String email, String otp) throws HireWaveException;

    ResponseDTO changePassword(LoginDTO loginDTO) throws HireWaveException;

    List<UserDTO> getAllUsers() throws HireWaveException;

    Page<UserDTO> getAllUsers(Pageable pageable) throws HireWaveException;

    void changeAccountStatus(Long id, String accountStatus) throws HireWaveException;
}
