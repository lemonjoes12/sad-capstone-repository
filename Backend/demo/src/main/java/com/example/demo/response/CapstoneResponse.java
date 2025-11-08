package com.example.demo.response;

import com.example.demo.entity.FileEntity;
import com.example.demo.entity.PictureEntity;
import com.example.demo.enumerated.CapstoneStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public class CapstoneResponse {

    private Long id;

    private String title;

    private int year;

    private String abstractDescription;

    private String professor;

    private CapstoneStatus capstoneStatus;

    private String categoryName;

    private List<StudentResponse> student;

    private String qrCodeBase64;

    private List<String> pictureUrl;

    private List<String> softcopyUrl;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;

    public CapstoneResponse() {
    }

    public List<String> getSoftcopyUrl() {
        return softcopyUrl;
    }

    public void setSoftcopyUrl(List<String> softcopyUrl) {
        this.softcopyUrl = softcopyUrl;
    }

    public List<String> getPictureUrl() {
        return pictureUrl;
    }

    public void setPictureUrl(List<String> pictureUrl) {
        this.pictureUrl = pictureUrl;
    }


    public CapstoneStatus getCapstoneStatus() {
        return capstoneStatus;
    }

    public void setCapstoneStatus(CapstoneStatus capstoneStatus) {
        this.capstoneStatus = capstoneStatus;
    }

    public String getQrCodeBase64() {
        return qrCodeBase64;
    }

    public void setQrCodeBase64(String qrCodeBase64) {
        this.qrCodeBase64 = qrCodeBase64;
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

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public List<StudentResponse> getStudent() {
        return student;
    }

    public void setStudent(List<StudentResponse> student) {
        this.student = student;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
