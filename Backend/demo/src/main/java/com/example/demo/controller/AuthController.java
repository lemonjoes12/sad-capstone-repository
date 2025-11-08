package com.example.demo.controller;

import com.example.demo.mapper.Mapper;
import com.example.demo.request.AdminRequest;
import com.example.demo.request.ChangePasswordRequest;
import com.example.demo.request.ForgotPasswordRequest;
import com.example.demo.request.ResetPasswordRequest;
import com.example.demo.response.AdminResponse;
import com.example.demo.serviceadmin.AuthService;
import com.example.demo.serviceadmin.ForgotPasswordService;
import com.example.demo.serviceadmin.ProfileService;
import com.example.demo.serviceadmin.ResetPasswordService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final ForgotPasswordService forgotPasswordService;
    private final ResetPasswordService resetPasswordService;
    private final ProfileService profileService;


    @Autowired
    public AuthController(AuthService authService, ForgotPasswordService forgotPasswordService, ResetPasswordService resetPasswordService, Mapper mapper, ProfileService profileService) {
        this.authService = authService;
        this.forgotPasswordService = forgotPasswordService;
        this.resetPasswordService = resetPasswordService;
        this.profileService = profileService;
    }
    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody AdminRequest adminRequest){
        authService.signUpAdmin(adminRequest);

        return ResponseEntity.ok("Signup Successful");
    }
    @PostMapping("/login")
    public ResponseEntity<AdminResponse> login(@RequestBody AdminRequest adminRequest, HttpSession session){
        AdminResponse response = authService.loginAdmin(adminRequest);

        session.setAttribute("LoggedInEmail",adminRequest.getEmail());
        session.setMaxInactiveInterval(1800);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/forgotPassword")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest forgotPasswordRequest){
        forgotPasswordService.forgotPassword(forgotPasswordRequest);

        return ResponseEntity.ok("Reset Code sent to your email");
    }
    @PostMapping("/resetPassword")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest){
        resetPasswordService.resetPassword(resetPasswordRequest);

        return  ResponseEntity.ok("Password Reset Successfully");
    }
    @GetMapping("/session")
    public ResponseEntity<String> getSession(HttpSession session){
        String loggedEmail =(String) session.getAttribute("LoggedInEmail");

        if (loggedEmail == null){
            return ResponseEntity.status(401).body("No Active session");
        }
        return ResponseEntity.ok("Logged In as " + loggedEmail);

    }
    @PostMapping("/changePassword")
public ResponseEntity<String> changePassword(ChangePasswordRequest changePasswordRequest,
                                             HttpSession session){
    String email = (String) session.getAttribute("LoggedInEmail");

    if (email == null){
        return ResponseEntity.status(401).body("not logged in");
    }

    profileService.changePassword(email, changePasswordRequest);
    return ResponseEntity.ok("Password Changed Successfully");
}
}
