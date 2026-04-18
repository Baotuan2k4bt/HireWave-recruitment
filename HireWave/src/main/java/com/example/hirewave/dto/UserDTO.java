package com.example.hirewave.dto;


import com.example.hirewave.Enum.AccountStatus;
import com.example.hirewave.Enum.AccountType;
import com.example.hirewave.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
	private Long id;

	@NotBlank(message = "{user.name.absent}")
	private String name;

	@NotBlank(message = "{user.email.absent}")
	@Email(message = "{user.email.invalid}")
	private String email;

	@NotBlank(message = "{user.password.absent}")
	@Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@#$%^&+=!]).{8,15}$", message = "{user.password.invalid}")
	private String password;

	private AccountType accountType;
	private Long profileId;
	private AccountStatus accountStatus;
	private LocalDateTime lastLoginDate;
	private String confirmPassword; // thêm dòng này
	public User toEntity() {
		return new User(this.id, this.name, this.email, this.password, this.accountType, this.profileId, this.accountStatus, this.lastLoginDate);
	}

}
