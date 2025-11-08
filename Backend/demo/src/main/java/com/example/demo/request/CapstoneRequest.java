package com.example.demo.request;

import com.example.demo.enumerated.CapstoneStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;

public class CapstoneRequest {
    @NotBlank(message = "title must not be blank")
    private String title;

    @NotNull(message = "year must not be null")
    private int year;

    @NotBlank(message = "abstractDescription must not be blank")
    private String abstractDescription;

    @NotBlank(message = "professor must not be blank")
    private String professor;

    private CapstoneStatus capstoneStatus;

    private Long categoryId;

    private List<StudentRequest> students = new ArrayList<>();


    public CapstoneRequest() {
    }

    public List<StudentRequest> getStudents() {
        return students;
    }

    public void setStudents(List<StudentRequest> students) {
        this.students = students;
    }

    public CapstoneStatus getCapstoneStatus() {
        return capstoneStatus;
    }

    public void setCapstoneStatus(CapstoneStatus capstoneStatus) {
        this.capstoneStatus = capstoneStatus;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public String getAbstractDescription() {
        return abstractDescription;
    }

    public void setAbstractDescription(String abstractDescription) {
        this.abstractDescription = abstractDescription;
    }

    public String getProfessor() {
        return professor;
    }

    public void setProfessor(String professor) {
        this.professor = professor;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }


}
