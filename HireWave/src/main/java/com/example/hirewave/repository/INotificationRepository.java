package com.example.hirewave.repository;

import com.example.hirewave.Enum.NotificationStatus;
import com.example.hirewave.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface INotificationRepository extends JpaRepository<Notification, Long> {
	List<Notification> findByUserIdAndStatus(Long userId, NotificationStatus status);
}