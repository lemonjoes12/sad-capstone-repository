package com.example.demo.serviceadmin;

import com.example.demo.entity.AdminEntity;
import com.example.demo.exception.EmailNotFoundException;
import com.example.demo.exception.PasswordConfirmationMismatchException;
import com.example.demo.exception.PasswordDoesNotMatchException;
import com.example.demo.mapper.Mapper;
import com.example.demo.repository.AdminRepository;
import com.example.demo.request.AdminRequest;
import com.example.demo.request.ChangePasswordRequest;
import com.example.demo.response.AdminResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class ProfileService {

    private final AdminRepository adminRepository;
    private final Mapper mapper;
    private final PasswordEncoder passwordEncoder;

    public ProfileService(AdminRepository adminRepository, Mapper mapper, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.mapper = mapper;
        this.passwordEncoder = passwordEncoder;
    }

    public AdminResponse updateProfile(AdminRequest adminRequest) throws IOException {

        AdminEntity admin = adminRepository.findByEmail(adminRequest.getEmail())
                .orElseThrow(()-> new EmailNotFoundException(adminRequest.getEmail()));

        admin.setAdminName(adminRequest.getAdminName());
        admin.setAdminId(adminRequest.getAdminId());

        MultipartFile file = adminRequest.getProfilePicture();
        if (file != null && !file.isEmpty()){
            String uploadDir = "uploads/";
            Files.createDirectories(Paths.get(uploadDir));

            String fileName = UUID.randomUUID()+ "_"+ file.getOriginalFilename();
            Path filePAth = Paths.get(uploadDir + fileName);
            Files.copy(file.getInputStream(), filePAth, StandardCopyOption.REPLACE_EXISTING);
            admin.setProfilePicture("/uploads/" + fileName);
        }
        AdminEntity saved = adminRepository.save(admin);

        return mapper.toResponseAdmin(saved);
    }
    public void changePassword(String email, ChangePasswordRequest changePasswordRequest){
        AdminEntity admin = adminRepository.findByEmail(email)
                .orElseThrow(()-> new EmailNotFoundException(email));

        if (passwordEncoder.matches(changePasswordRequest.getOldPassword(), admin.getPassword())){
            throw new PasswordDoesNotMatchException();
        }
        if (!changePasswordRequest.getNewPassword().equals(changePasswordRequest.getConfirmPassword())){
            throw new PasswordConfirmationMismatchException();
        }

        admin.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));

        adminRepository.save(admin);

    }
}
