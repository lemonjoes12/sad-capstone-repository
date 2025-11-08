package com.example.demo.request;

import jakarta.validation.constraints.NotBlank;
import org.springframework.web.multipart.MultipartFile;

public class AdminRequest {
    @NotBlank(message = "adminName must not be blank")
    private String adminName;
    @NotBlank(message = "adminId must not be blank")
    private String adminId;
    @NotBlank(message = "username must not be blank")
    private String email;
    @NotBlank(message = "password must not be blank")
    private String password;

    private MultipartFile profilePicture;

    public AdminRequest() {
    }

    public MultipartFile getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(MultipartFile profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getAdminName() {
        return adminName;
    }

    public void setAdminName(String adminName) {
        this.adminName = adminName;
    }

    public String getAdminId() {
        return adminId;
    }

    public void setAdminId(String adminId) {
        this.adminId = adminId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
