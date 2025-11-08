package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
public class FileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String capstoneDigitalCopy;

    private String filepath;
    @ManyToOne
    @JoinColumn(name = "capstone_id")
    private CapstoneEntity capstone;

    public CapstoneEntity getCapstone() {
        return capstone;
    }

    public String getFilepath() {
        return filepath;
    }

    public void setFilepath(String filepath) {
        this.filepath = filepath;
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

    public String getCapstoneDigitalCopy() {
        return capstoneDigitalCopy;
    }

    public void setCapstoneDigitalCopy(String capstoneDigitalCopy) {
        this.capstoneDigitalCopy = capstoneDigitalCopy;
    }
}
