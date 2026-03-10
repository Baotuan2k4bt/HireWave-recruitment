package com.example.hirewave.utility;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class Utilities {
	public String generateOTP() {
		StringBuilder otp = new StringBuilder();
		SecureRandom secureRandom = new SecureRandom();
		for (int i = 0; i < 6; i++) {
			otp.append(secureRandom.nextInt(10));
		}
		return otp.toString();
	}
}