package com.example.hirewave;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@EnableCaching
@SpringBootApplication
public class HireWaveApplication {

    public static void main(String[] args) {
        SpringApplication.run(HireWaveApplication.class, args);
    }

}
