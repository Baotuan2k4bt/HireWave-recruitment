package com.example.hirewave.service;

import com.example.hirewave.dto.NotificationDTO;
import com.example.hirewave.Enum.NotificationStatus;
import com.example.hirewave.entity.Notification;
import com.example.hirewave.exception.HireWaveException;
import com.example.hirewave.repository.INotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service("notificationService")
public class NotificationServiceImpl implements NotificationService {
	@Autowired
	private INotificationRepository INotificationRepository;

	@Override
	public void sendNotification(NotificationDTO notificationDTO) throws HireWaveException {
		notificationDTO.setStatus(NotificationStatus.UNREAD);
		notificationDTO.setTimestamp(LocalDateTime.now());
		Notification savedNotification = INotificationRepository.save(notificationDTO.toEntity());
		// ID is set by JPA, no need to set it manually
	}

	@Override
	public List<Notification> getUnreadNotifications(Long userId) {
		return INotificationRepository.findByUserIdAndStatus(userId, NotificationStatus.UNREAD);
	}

	@Override
	public void readNotification(Long id) throws HireWaveException {
		Notification noti = INotificationRepository.findById(id)
				.orElseThrow(() -> new HireWaveException("No Notification found"));
		noti.setStatus(NotificationStatus.READ);
		INotificationRepository.save(noti);
	}
}