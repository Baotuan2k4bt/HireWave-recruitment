package com.example.hirewave.service;
import com.example.hirewave.dto.NotificationDTO;
import com.example.hirewave.entity.Notification;
import com.example.hirewave.exception.HireWaveException;

import java.util.List;
public interface NotificationService {
	void sendNotification(NotificationDTO notificationDTO) throws HireWaveException;
	List<Notification> getUnreadNotifications(Long userId);
	void readNotification(Long id) throws HireWaveException;
}