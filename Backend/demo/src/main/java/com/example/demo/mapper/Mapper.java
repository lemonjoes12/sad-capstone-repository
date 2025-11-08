package com.example.demo.mapper;

import com.example.demo.entity.AdminEntity;
import com.example.demo.entity.CapstoneEntity;
import com.example.demo.entity.CategoryEntity;
import com.example.demo.entity.StudentEntity;
import com.example.demo.request.AdminRequest;
import com.example.demo.request.CapstoneRequest;
import com.example.demo.request.StudentRequest;
import com.example.demo.response.AdminResponse;
import com.example.demo.response.CapstoneResponse;
import com.example.demo.response.StudentResponse;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class Mapper {
    public CapstoneEntity toCapstoneEntity(
            CapstoneRequest capstoneRequest){

        CapstoneEntity entity = new CapstoneEntity();

        entity.setTitle(capstoneRequest.getTitle());
        entity.setYear(capstoneRequest.getYear());
        entity.setAbstractDescription(capstoneRequest.getAbstractDescription());
        entity.setProfessor(capstoneRequest.getProfessor());
        entity.setCapstoneStatus(capstoneRequest.getCapstoneStatus());

        List<StudentEntity> studentEntities = new ArrayList<>();
        for (StudentRequest sr : capstoneRequest.getStudents()){
            StudentEntity studentEntity = new StudentEntity();

            studentEntity.setName(sr.getName());
            studentEntity.setEmail(sr.getEmail());
            studentEntity.setCourseSection(sr.getCourseSection());
            studentEntities.add(studentEntity);
        }
        entity.setStudent(studentEntities);



        return entity;
    }
    public CapstoneResponse toCapstoneResponse(CapstoneEntity capstoneEntity){
        CapstoneResponse response = new CapstoneResponse();

        response.setId(capstoneEntity.getId());
        response.setTitle(capstoneEntity.getTitle());
        response.setYear(capstoneEntity.getYear());
        response.setAbstractDescription(capstoneEntity.getAbstractDescription());
        response.setProfessor(capstoneEntity.getProfessor());
        response.setCategoryName(capstoneEntity.getCategory().getName());
        response.setCapstoneStatus(capstoneEntity.getCapstoneStatus());
        response.setUpdatedAt(capstoneEntity.getUpdatedAt());
        response.setCreatedAt(capstoneEntity.getCreatedAt());

        List<StudentResponse> studentResponses = capstoneEntity.getStudent()
                .stream()
                .map(student ->{
                    StudentResponse s = new StudentResponse();
                    s.setName(student.getName());
                    s.setEmail(student.getEmail());
                    s.setId(student.getId());
                    s.setCourseSection(student.getCourseSection());

                    return s;
                }).toList();

        response.setStudent(studentResponses);

        return response;
    }
    public AdminEntity toEntityAdmin(AdminRequest adminRequest){
        AdminEntity toAdmin = new AdminEntity();


        toAdmin.setAdminName(adminRequest.getAdminName());
        toAdmin.setAdminId(adminRequest.getAdminId());
        toAdmin.setEmail(adminRequest.getEmail());
        toAdmin.setPassword(adminRequest.getPassword());

         return toAdmin;
    }

    public AdminResponse toResponseAdmin(AdminEntity adminEntity){

        AdminResponse response = new AdminResponse();

        response.setId(adminEntity.getId());
        response.setAdminId(adminEntity.getAdminId());
        response.setAdminName(adminEntity.getAdminName());
        response.setEmail(adminEntity.getEmail());
        response.setCreatedAt(adminEntity.getCreatedAt());
        response.setUpdatedAt(adminEntity.getUpdatedAt());

        return  response;
    }


}
