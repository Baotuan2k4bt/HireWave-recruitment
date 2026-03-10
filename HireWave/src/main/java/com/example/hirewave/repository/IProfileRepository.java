package com.example.hirewave.repository;


import com.example.hirewave.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IProfileRepository extends JpaRepository<Profile, Long> {
    Profile findByEmail(String email);
}