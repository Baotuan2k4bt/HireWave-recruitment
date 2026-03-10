package com.example.hirewave.entity;


import com.example.hirewave.dto.NotificationDTO;
import com.example.hirewave.Enum.NotificationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "notifications", indexes = {
	@Index(name = "idx_notification_user", columnList = "userId"),
	@Index(name = "idx_notification_status", columnList = "status"),
	@Index(name = "idx_notification_user_status", columnList = "userId,status")
}) // Changed to plural for consistency
public class Notification {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private Long userId;
	private String message;
	private String action;
	private String route;
	private NotificationStatus status;
	private LocalDateTime timestamp;

	public NotificationDTO toDTO() {
		return new NotificationDTO(
				this.id,
				this.userId,
				this.message,
				this.action,
				this.route,
				this.status,
				this.timestamp
		);
	}
}