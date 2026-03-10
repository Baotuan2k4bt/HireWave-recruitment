package com.example.hirewave.service;
import com.example.hirewave.Enum.AccountStatus;
import com.example.hirewave.Enum.AccountType;
import com.example.hirewave.dto.NotificationDTO;
import com.example.hirewave.entity.User;
import com.example.hirewave.exception.HireWaveException;
import com.example.hirewave.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {
    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Override
    public List<User> getPendingEmployers() {
        // Optimized: Query at database level instead of loading all users and filtering in memory
        return userRepository.findByAccountTypeAndAccountStatus(
                AccountType.EMPLOYER,
                AccountStatus.PENDING_APPROVAL);
    }

    @Override
    @Transactional
    public void approveEmployer(Long id) throws HireWaveException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new HireWaveException("USER_NOT_FOUND"));

        if (user.getAccountType() != AccountType.EMPLOYER) {
            throw new HireWaveException("USER_NOT_EMPLOYER");
        }

        user.setAccountStatus(AccountStatus.ACTIVE);
        userRepository.save(user);

        // Send notification
        notificationService.sendNotification(createNotification(user.getId(),
                "Account Approved",
                "Your employer account has been approved. You can now login and post jobs."));
    }

    @Override
    @Transactional
    public void rejectEmployer(Long id) throws HireWaveException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new HireWaveException("USER_NOT_FOUND"));

        if (user.getAccountType() != AccountType.EMPLOYER) {
            throw new HireWaveException("USER_NOT_EMPLOYER");
        }

        user.setAccountStatus(AccountStatus.REJECTED);
        userRepository.save(user);

        // Send notification
        notificationService.sendNotification(createNotification(user.getId(),
                "Account Rejected",
                "Your employer account has been rejected. Please contact support for more information."));
    }


    private NotificationDTO createNotification(Long userId, String action, String message) {
        NotificationDTO notification = new NotificationDTO();
        notification.setUserId(userId);
        notification.setAction(action);
        notification.setMessage(message);
        return notification;
    }
}