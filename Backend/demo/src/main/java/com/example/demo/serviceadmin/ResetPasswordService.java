package com.example.demo.serviceadmin;

import com.example.demo.entity.AdminEntity;
import com.example.demo.exception.InvalidCodeException;
import com.example.demo.repository.AdminRepository;
import com.example.demo.request.ResetPasswordRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ResetPasswordService {
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;


    @Autowired
    public ResetPasswordService(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void resetPassword(ResetPasswordRequest passwordRequest){
        AdminEntity admin = adminRepository.findByResetCode(passwordRequest.getCode())
                .orElseThrow(InvalidCodeException::new);

        if (admin.getResetCodeExpiration().isBefore(LocalDateTime.now())){
            throw new RuntimeException("Reset Code has Expired");
        }
        if (!passwordRequest.getNewPassword().equals(passwordRequest.getConfirmPassword())){
            throw new RuntimeException("Password do not match");
        }

        admin.setPassword(passwordEncoder.encode(passwordRequest.getNewPassword()));
        admin.setResetCode(null);
        admin.setResetCodeExpiration(null);

        adminRepository.save(admin);
    }
}
