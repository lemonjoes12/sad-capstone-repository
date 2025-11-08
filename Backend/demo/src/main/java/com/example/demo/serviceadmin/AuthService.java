package com.example.demo.serviceadmin;

import com.example.demo.entity.AdminEntity;
import com.example.demo.exception.EmailAlreadyExistException;
import com.example.demo.exception.EmailNotFoundException;
import com.example.demo.exception.InvalidPasswordException;
import com.example.demo.mapper.Mapper;
import com.example.demo.repository.AdminRepository;
import com.example.demo.request.AdminRequest;
import com.example.demo.response.AdminResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final AdminRepository adminRepository;
    private final Mapper mapper;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(AdminRepository adminRepository,
                       Mapper mapper,
                       PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.mapper = mapper;
        this.passwordEncoder = passwordEncoder;
    }
    public void signUpAdmin(AdminRequest adminRequest){
        if (adminRepository.existsByEmail(adminRequest.getEmail())){
            throw new EmailAlreadyExistException(adminRequest.getEmail());
        }
        AdminEntity adminEntity = mapper.toEntityAdmin(adminRequest);

        adminEntity.setPassword(passwordEncoder.encode(adminEntity.getPassword()));

        adminRepository.save(adminEntity);
    }
    public AdminResponse loginAdmin(AdminRequest adminRequest){
        AdminEntity adminEntity = adminRepository.findByEmail(adminRequest.getEmail())
                .orElseThrow(()-> new EmailNotFoundException(adminRequest.getEmail()));

        if(!passwordEncoder.matches(adminRequest.getPassword(), adminEntity.getPassword())){
            throw new InvalidPasswordException();
        }
        return mapper.toResponseAdmin(adminEntity);

    }
}
