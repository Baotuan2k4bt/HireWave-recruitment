package com.example.hirewave.utility;


import com.example.hirewave.exception.HireWaveException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
public class ExceptionControllerAdvice {
	
	private static final Logger logger = LoggerFactory.getLogger(ExceptionControllerAdvice.class);
	
	@Autowired
	private Environment environment;
	
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorInfo>generalExceptionHandler(Exception exception){
		logger.error("Unexpected error occurred", exception);
		ErrorInfo error=new ErrorInfo("An unexpected error occurred. Please try again later.", 
				HttpStatus.INTERNAL_SERVER_ERROR.value(), LocalDateTime.now());
		return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	@ExceptionHandler(HireWaveException.class)
	public ResponseEntity<ErrorInfo>jobPortalExceptionHandler(HireWaveException exception){
		String msg=environment.getProperty(exception.getMessage());
		if (msg == null || msg.isEmpty()) {
			msg = exception.getMessage();
		}
		
		// Determine appropriate HTTP status based on error type
		HttpStatus status = determineHttpStatus(exception.getMessage());
		
		logger.warn("Business exception: {} - {}", exception.getMessage(), msg);
		ErrorInfo error=new ErrorInfo(msg, status.value(), LocalDateTime.now());
		return new ResponseEntity<>(error, status);
	}
	
	private HttpStatus determineHttpStatus(String errorCode) {
		if (errorCode == null) {
			return HttpStatus.INTERNAL_SERVER_ERROR;
		}
		
		// Map error codes to HTTP status codes
		if (errorCode.contains("NOT_FOUND")) {
			return HttpStatus.NOT_FOUND;
		} else if (errorCode.contains("FOUND") || errorCode.contains("ALREADY")) {
			return HttpStatus.CONFLICT;
		} else if (errorCode.contains("INVALID") || errorCode.contains("INCORRECT")) {
			return HttpStatus.BAD_REQUEST;
		} else if (errorCode.contains("BLOCKED") || errorCode.contains("PENDING_APPROVAL")) {
			return HttpStatus.FORBIDDEN;
		} else {
			return HttpStatus.INTERNAL_SERVER_ERROR;
		}
	}
	@ExceptionHandler({MethodArgumentNotValidException.class, ConstraintViolationException.class})
    public ResponseEntity<ErrorInfo> validatorExceptionHandler(Exception exception) {
        String errorMsg;
        if (exception instanceof MethodArgumentNotValidException manvException) {
            errorMsg = manvException.getBindingResult().getAllErrors().stream().map(ObjectError::getDefaultMessage)
                    .collect(Collectors.joining(", "));
        } else {    
            ConstraintViolationException cvException = (ConstraintViolationException) exception;
            errorMsg = cvException.getConstraintViolations().stream().map(ConstraintViolation::getMessage)
                    .collect(Collectors.joining(", "));
        }
        ErrorInfo errorInfo = new ErrorInfo();
        errorInfo.setErrorMessage(errorMsg);
        errorInfo.setErrorCode(HttpStatus.BAD_REQUEST.value());
        errorInfo.setTimeStamp(LocalDateTime.now());
        return new ResponseEntity<>(errorInfo, HttpStatus.BAD_REQUEST);
	}
	@ExceptionHandler({DisabledException.class, LockedException.class})
	public ResponseEntity<ErrorInfo> handleSecurityException(Exception ex) {
		ErrorInfo error = new ErrorInfo(
				ex.getMessage(),
				HttpStatus.FORBIDDEN.value(),
				LocalDateTime.now()
		);
		return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
	}
}
