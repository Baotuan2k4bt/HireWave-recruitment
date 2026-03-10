package com.example.hirewave.service;

import com.example.hirewave.Enum.AccountStatus;
import com.example.hirewave.Enum.AccountType;
import com.example.hirewave.dto.LoginDTO;
import com.example.hirewave.dto.NotificationDTO;
import com.example.hirewave.dto.ResponseDTO;
import com.example.hirewave.dto.UserDTO;
import com.example.hirewave.entity.OTP;
import com.example.hirewave.entity.User;
import com.example.hirewave.exception.HireWaveException;
import com.example.hirewave.repository.IOTPRepository;
import com.example.hirewave.repository.IUserRepository;
import com.example.hirewave.utility.EmailUtil;
import com.example.hirewave.utility.Utilities;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service("userService")
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final IUserRepository userRepository;
	private final IOTPRepository otpRepository;
	private final ProfileService profileService;
	private final PasswordEncoder passwordEncoder;
	private final JavaMailSender mailSender;
	private final NotificationService notificationService;
	private final Utilities utilities;

	@Override
	@Transactional
	public UserDTO registerUser(UserDTO userDTO) throws HireWaveException {
		if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
			throw new HireWaveException("USER_FOUND");
		}

		userDTO.setPassword(passwordEncoder.encode(userDTO.getPassword()));
		userDTO.setProfileId(profileService.createProfile(userDTO));

		// Initial status based on account type
		if (userDTO.getAccountType() == AccountType.EMPLOYER) {
			userDTO.setAccountStatus(AccountStatus.PENDING_APPROVAL);
		} else {
			userDTO.setAccountStatus(AccountStatus.ACTIVE);
		}

		userDTO.setLastLoginDate(LocalDateTime.now());

		User user = userRepository.save(userDTO.toEntity());
		UserDTO saved = user.toDTO();
		saved.setPassword(null);
		return saved;
	}

	@Override
	@Transactional
	public UserDTO loginUser(LoginDTO loginDTO) throws HireWaveException {
		User user = userRepository.findByEmail(loginDTO.getEmail())
				.orElseThrow(() -> new HireWaveException("USER_NOT_FOUND"));

		// Check status first
		if (user.getAccountStatus() == AccountStatus.BLOCKED) {
			throw new HireWaveException("ACCOUNT_BLOCKED");
		}
		if (user.getAccountStatus() == AccountStatus.PENDING_APPROVAL) {
			throw new HireWaveException("ACCOUNT_PENDING_APPROVAL");
		}

		if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
			throw new HireWaveException("INVALID_CREDENTIALS");
		}

		// Update last login
		user.setLastLoginDate(LocalDateTime.now());

		// Auto-reactivate
		if (user.getAccountStatus() == AccountStatus.INACTIVE) {
			String oldStatus = user.getAccountStatus().toString();
			user.setAccountStatus(AccountStatus.ACTIVE);

			sendStatusChangeNotification(
					user,
					oldStatus,
					"ACTIVE",
					"Your account has been reactivated after successful login."
			);
		}

		user = userRepository.save(user);

		UserDTO dto = user.toDTO();
		dto.setPassword(null);
		return dto;
	}

	@Override
	@Transactional
	public Boolean sendOTP(String email) throws HireWaveException {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new HireWaveException("USER_NOT_FOUND"));

		try {
			String generatedOtp = utilities.generateOTP();

			// Save OTP (overwrite behavior depends on OTP PK design)
			OTP otp = new OTP(email, generatedOtp, LocalDateTime.now());
			otpRepository.save(otp);

			MimeMessage mm = mailSender.createMimeMessage();
			MimeMessageHelper message = new MimeMessageHelper(mm, true, "UTF-8");
			message.setTo(email);
			message.setFrom("vuducduy1112004@gmail.com", "HireWave");
			message.setSubject("Your OTP Code");
			message.setText(EmailUtil.getOtpEmailBody(generatedOtp, user.getName()), true);

			mailSender.send(mm);
			log.info("OTP sent to {}", email);
			return true;
		} catch (Exception e) {
			log.error("Failed to send OTP to {}", email, e);
			throw new HireWaveException("OTP_SEND_FAILED");
		}
	}

	@Override
	@Transactional
	public Boolean verifyOtp(String email, String otp) throws HireWaveException {
		OTP otpEntity = otpRepository.findById(email)
				.orElseThrow(() -> new HireWaveException("OTP_NOT_FOUND"));

		// Optional: check expiry here (if you want strict expiry on verify)
		// if (otpEntity.getCreationTime().isBefore(LocalDateTime.now().minusMinutes(5))) {
		//     otpRepository.delete(otpEntity);
		//     throw new HireWaveException("OTP_NOT_FOUND");
		// }

		if (!otpEntity.getOtpCode().equals(otp)) {
			throw new HireWaveException("OTP_INCORRECT");
		}

		// Good practice: delete OTP after successful verify
		otpRepository.delete(otpEntity);
		return true;
	}

	/**
	 * Clean expired OTP every 60 seconds.
	 * Note: should NOT throw checked exceptions.
	 */
	@Scheduled(fixedRate = 60_000)
	public void removeExpiredOTPs() {
		try {
			LocalDateTime expiryTime = LocalDateTime.now().minusMinutes(5);
			List<OTP> expired = otpRepository.findByCreationTimeBefore(expiryTime);

			if (!expired.isEmpty()) {
				otpRepository.deleteAll(expired);
				log.info("Removed {} expired OTPs", expired.size());
			}
		} catch (Exception e) {
			log.error("removeExpiredOTPs failed", e);
		}
	}

	@Override
	@Transactional
	public ResponseDTO changePassword(LoginDTO loginDTO) throws HireWaveException {
		User user = userRepository.findByEmail(loginDTO.getEmail())
				.orElseThrow(() -> new HireWaveException("USER_NOT_FOUND"));

		user.setPassword(passwordEncoder.encode(loginDTO.getPassword()));
		userRepository.save(user);

		NotificationDTO noti = new NotificationDTO();
		noti.setUserId(user.getId());
		noti.setMessage("Password Reset Successful");
		noti.setAction("Password Reset");
		notificationService.sendNotification(noti);

		return new ResponseDTO("Password changed successfully.");
	}

	@Override
	public List<UserDTO> getAllUsers() throws HireWaveException {
		List<User> users = userRepository.findAll();
		if (users.isEmpty()) {
			throw new HireWaveException("NO_USERS_FOUND");
		}
		return users.stream().map(User::toDTO).toList();
	}

	@Override
	public Page<UserDTO> getAllUsers(Pageable pageable) throws HireWaveException {
		Page<User> usersPage = userRepository.findAll(pageable);
		if (usersPage.isEmpty()) {
			throw new HireWaveException("NO_USERS_FOUND");
		}
		return usersPage.map(User::toDTO);
	}

	@Override
	@Transactional
	public void changeAccountStatus(Long id, String accountStatus) throws HireWaveException {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new HireWaveException("USER_NOT_FOUND"));

		String oldStatus = user.getAccountStatus().toString();
		String reason;

		if ("ACTIVE".equalsIgnoreCase(accountStatus)) {
			user.setAccountStatus(AccountStatus.ACTIVE);
			reason = "Your account is now active.";
		} else if ("INACTIVE".equalsIgnoreCase(accountStatus)) {
			user.setAccountStatus(AccountStatus.INACTIVE);
			reason = "Your account has been marked as inactive due to inactivity.";
		} else if ("BLOCKED".equalsIgnoreCase(accountStatus)) {
			user.setAccountStatus(AccountStatus.BLOCKED);
			reason = "Your account has been blocked. Please contact support.";
		} else {
			throw new HireWaveException("INVALID_STATUS");
		}

		userRepository.save(user);
		sendStatusChangeNotification(user, oldStatus, accountStatus.toUpperCase(), reason);
	}

	@Override
	public UserDTO getUserByEmail(String email) throws HireWaveException {
		return userRepository.findByEmail(email)
				.orElseThrow(() -> new HireWaveException("USER_NOT_FOUND"))
				.toDTO();
	}

	/**
	 * Daily at midnight: mark ACTIVE users as INACTIVE if not login for 15 days.
	 * Note: do not throw checked exception in @Scheduled method.
	 */
	@Scheduled(cron = "0 0 0 * * ?")
	public void checkInactiveUsers() {
		try {
			LocalDateTime threshold = LocalDateTime.now().minusDays(15);
			List<User> users = userRepository.findByLastLoginDateBeforeAndAccountStatus(
					threshold, AccountStatus.ACTIVE
			);

			for (User user : users) {
				String oldStatus = user.getAccountStatus().toString();
				user.setAccountStatus(AccountStatus.INACTIVE);
				userRepository.save(user);

				sendStatusChangeNotification(
						user,
						oldStatus,
						"INACTIVE",
						"Your account has been marked as inactive due to 15 days of inactivity."
				);
			}
		} catch (Exception e) {
			log.error("checkInactiveUsers failed", e);
		}
	}

	private void sendStatusChangeNotification(User user, String oldStatus, String newStatus, String reason)
			throws HireWaveException {

		// In-app notification
		NotificationDTO notification = new NotificationDTO();
		notification.setUserId(user.getId());
		notification.setAction("Account Status Change");
		notification.setMessage(String.format(
				"Your account status has been changed from %s to %s. %s",
				oldStatus, newStatus, reason
		));

		notificationService.sendNotification(notification);

		// Send email async (do not block)
		sendStatusChangeEmailAsync(user.getEmail(), oldStatus, newStatus, reason);
	}

	@Async("emailExecutor")
	public void sendStatusChangeEmailAsync(String email, String oldStatus, String newStatus, String reason) {
		try {
			MimeMessage emailMessage = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(emailMessage, true, "UTF-8");

			helper.setTo(email);
			helper.setFrom("vuducduy1112004@gmail.com", "HireWave");
			helper.setSubject("Account Status Change Notification");

			String message = String.format(
					"Your account status has been changed from %s to %s. %s",
					oldStatus, newStatus, reason
			);
			helper.setText(message, true);

			mailSender.send(emailMessage);
			log.info("Status change email sent to {}", email);
		} catch (Exception e) {
			log.error("Failed to send status change email to {}: {}", email, e.getMessage(), e);
		}
	}
}
