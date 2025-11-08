package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
public class PictureEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private String filePath;

    @ManyToOne
    @JoinColumn(name = "capstone_id")
    private CapstoneEntity capstone;

    public PictureEntity() {

    }

    public CapstoneEntity getCapstone() {
        return capstone;
    }

    public void setCapstone(CapstoneEntity capstone) {
        this.capstone = capstone;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

}
