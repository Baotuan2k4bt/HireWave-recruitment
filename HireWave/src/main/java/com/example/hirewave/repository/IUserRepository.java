package com.example.hirewave.repository;

import com.example.hirewave.Enum.AccountStatus;
import com.example.hirewave.Enum.AccountType;
import com.example.hirewave.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface IUserRepository extends JpaRepository<User, Long> {
	Optional<User> findByEmail(String email);
	List<User> findByLastLoginDateBeforeAndAccountStatus(LocalDateTime date, AccountStatus status);
	
	// Optimized query to avoid loading all users and filtering in memory
	@Query("SELECT u FROM User u WHERE u.accountType = :accountType AND u.accountStatus = :accountStatus")
	List<User> findByAccountTypeAndAccountStatus(
			@Param("accountType") AccountType accountType,
			@Param("accountStatus") AccountStatus accountStatus);
	
	// Batch load users by IDs to avoid N+1 queries
	List<User> findAllByIdIn(Collection<Long> ids);
}