package com.example.hirewave.entity;
import com.example.hirewave.Enum.AccountStatus;
import com.example.hirewave.Enum.AccountType;
import com.example.hirewave.dto.UserDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users", indexes = {
	@Index(name = "idx_user_status", columnList = "accountStatus"),
	@Index(name = "idx_user_type", columnList = "accountType"),
	@Index(name = "idx_user_lastlogin", columnList = "lastLoginDate"),
	@Index(name = "idx_user_type_status", columnList = "accountType,accountStatus")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name;

	@Column(unique = true)
	private String email;

	private String password;

	private AccountType accountType;

	private Long profileId;

	private AccountStatus accountStatus;

	private LocalDateTime lastLoginDate;
	public UserDTO toDTO() {
		return new UserDTO(
				this.id,
				this.name,
				this.email,
				this.password,
				this.accountType,
				this.profileId,
				this.accountStatus,
				this.lastLoginDate,
				null
		);
	}
}