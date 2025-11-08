package com.example.demo.serviceadmin;

import com.example.demo.entity.AdminEntity;
import com.example.demo.exception.EmailNotFoundException;
import com.example.demo.repository.AdminRepository;
import com.example.demo.request.ForgotPasswordRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class ForgotPasswordService {

    private final AdminRepository adminRepository;
    private final JavaMailSender javaMailSender;

    @Autowired
    public ForgotPasswordService(AdminRepository adminRepository, JavaMailSender javaMailSender){
        this.adminRepository = adminRepository;
        this.javaMailSender = javaMailSender;
    }
    public void forgotPassword(ForgotPasswordRequest forgotPasswordRequest){
        AdminEntity admin = adminRepository.findByEmail(forgotPasswordRequest.getEmail()).
                orElseThrow(()-> new EmailNotFoundException(forgotPasswordRequest.getEmail()));

        String resetCode = String.format("%06d", new Random().nextInt(999999));

        admin.setResetCode(resetCode);
        admin.setResetCodeExpiration(LocalDateTime.now().plusMinutes(5));
        adminRepository.save(admin);

        SimpleMailMessage sendEmail = new SimpleMailMessage();

        sendEmail.setTo(forgotPasswordRequest.getEmail());
        sendEmail.setSubject("Password Reset Code");
        sendEmail.setText("your Password reset Code is: " + resetCode + " This code will expired in 5 minutes");

        javaMailSender.send(sendEmail);
    }
}
