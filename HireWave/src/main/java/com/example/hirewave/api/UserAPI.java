package com.example.hirewave.api;


import com.example.hirewave.dto.LoginDTO;
import com.example.hirewave.dto.ResponseDTO;
import com.example.hirewave.dto.UserDTO;
import com.example.hirewave.exception.HireWaveException;
import com.example.hirewave.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/users")
@Validated
public class UserAPI {
	@Autowired
	private UserService userService;
	
	@PostMapping("/register")
	public ResponseEntity<UserDTO>registerUser(@RequestBody @Valid UserDTO userDTO) throws HireWaveException {
		return new ResponseEntity<>(userService.registerUser(userDTO), HttpStatus.CREATED);
	} 
	@PostMapping("/login")
	public ResponseEntity<UserDTO>loginUser(@RequestBody @Valid LoginDTO loginDTO) throws HireWaveException {
		return new ResponseEntity<>(userService.loginUser(loginDTO), HttpStatus.OK);
	}
	@PostMapping("/changePass")
	public ResponseEntity<ResponseDTO>changePassword(@RequestBody @Valid LoginDTO loginDTO) throws HireWaveException {
		return new ResponseEntity<>(userService.changePassword(loginDTO), HttpStatus.OK);
	}
	@PostMapping("/sendOtp/{email}")
	public ResponseEntity<ResponseDTO>sendOtp(@PathVariable @Email(message="{user.email.invalid}")  String email) throws Exception{
		userService.sendOTP(email);
		ResponseDTO response=new ResponseDTO("OTP sent successfully.");
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	@GetMapping("/verifyOtp/{email}/{otp}")
	public ResponseEntity<ResponseDTO>verifyOtp(@PathVariable @NotBlank(message="{user.email.absent}") @Email(message="{user.email.invalid}")  String email, @PathVariable @Pattern(regexp = "^[0-9]{6}$", message = "{otp.invalid}") String otp) throws HireWaveException {
		userService.verifyOtp(email, otp);
		return new ResponseEntity<>(new ResponseDTO("OTP has been verified."), HttpStatus.ACCEPTED);
	}
	
	@GetMapping("/getAll/paged")
	public ResponseEntity<org.springframework.data.domain.Page<UserDTO>>getAllUsersPaged(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size,
			@RequestParam(defaultValue = "id") String sortBy) throws HireWaveException {
		org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size, 
				org.springframework.data.domain.Sort.Direction.DESC, sortBy);
		return new ResponseEntity<>(userService.getAllUsers(pageable), HttpStatus.OK);
	}
}
