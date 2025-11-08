package com.example.demo.entity;

import com.example.demo.enumerated.CapstoneStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class CapstoneEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private int year;

    @Lob
    @Column(nullable = false)
    private String abstractDescription;

    private String professor;

    @Enumerated(EnumType.STRING)
    private CapstoneStatus capstoneStatus;

    @CreationTimestamp
    LocalDateTime createdAt;

    @UpdateTimestamp
    LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false)
    private AdminEntity admin;

    @ManyToOne
    @JoinColumn(name = "category", nullable = false)
    private CategoryEntity category;

    @OneToMany(mappedBy = "capstone", cascade = CascadeType.ALL)
    private List<PictureEntity> picture = new ArrayList<>();

    @OneToMany(mappedBy = "capstone", cascade = CascadeType.ALL)
    private List<FileEntity> files = new ArrayList<>();

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "student_capstone",
            joinColumns = @JoinColumn(name = "capstone_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private List<StudentEntity> students = new ArrayList<>();

    public CapstoneEntity() {
    }

    public CapstoneStatus getCapstoneStatus() {
        return capstoneStatus;
    }

    public void setCapstoneStatus(CapstoneStatus capstoneStatus) {
        this.capstoneStatus = capstoneStatus;
    }

    public List<PictureEntity> getPicture() {
        return picture;
    }

    public void setPicture(List<PictureEntity> picture) {
        this.picture = picture;
    }

    public List<FileEntity> getFiles() {
        return files;
    }

    public void setFiles(List<FileEntity> files) {
        this.files = files;
    }

    public List<StudentEntity> getStudents() {
        return students;
    }

    public void setStudents(List<StudentEntity> students) {
        this.students = students;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public AdminEntity getAdmin() {
        return admin;
    }

    public void setAdmin(AdminEntity admin) {
        this.admin = admin;
    }

    public CategoryEntity getCategory() {
        return category;
    }

    public void setCategory(CategoryEntity category) {
        this.category = category;
    }

    public List<StudentEntity> getStudent() {
        return students;
    }

    public void setStudent(List<StudentEntity> student) {
        this.students = student;
    }
}

