package com.example.demo.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class StudentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private  String name;

    private String email;

    private String courseSection;

    @CreationTimestamp
    LocalDateTime createdAt;
    @UpdateTimestamp
    LocalDateTime updatedAt;

    @ManyToMany(mappedBy = "students", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
        private List<CapstoneEntity> capstones = new ArrayList<>();


    public StudentEntity() {

    }
    public void addCapstone(CapstoneEntity capstoneEntity) {
        capstones.add(capstoneEntity);
        capstoneEntity.getStudent().add(this);
    }

    public void removeCapstone(CapstoneEntity capstoneEntity) {
        capstones.remove(capstoneEntity);
        capstoneEntity.getStudent().remove(this);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public List<CapstoneEntity> getCapstone() {
        return capstones;
    }

    public void setCapstone(List<CapstoneEntity> capstone) {
        this.capstones = capstone;
    }
}
