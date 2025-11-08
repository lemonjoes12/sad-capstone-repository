package com.example.demo.request;

import jakarta.validation.constraints.NotBlank;

public class StudentRequest {
    @NotBlank(message = "name must not be blank")
    private  String name;

    @NotBlank(message = "email must not be blank")
    private String email;

    @NotBlank(message = "courseSection must not be blank")
    private String courseSection;


    public StudentRequest() {
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCourseSection() {
        return courseSection;
    }

    public void setCourseSection(String courseSection) {
        this.courseSection = courseSection;
    }
}
