package com.example.hirewave.jwt;

import lombok.Data;

@Data
public class AuthenticationResponse {
	public AuthenticationResponse(String jwt) {
		this.jwt=jwt;
	}

	private final String jwt;
}
