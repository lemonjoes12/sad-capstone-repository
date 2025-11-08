package com.example.demo.repository;

import com.example.demo.entity.AdminEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<AdminEntity, Long> {
    boolean existsByEmail(String email);

    Optional<AdminEntity> findByEmail(String email);

    Optional<AdminEntity> findByResetCode(String resetCode );
}
