package com.example.demo.response;

import com.example.demo.enumerated.CapstoneStatus;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

public class GetAllCapstoneResponse {

    private Long id;

    private String title;
    private CapstoneStatus status;
    private int year;

    public GetAllCapstoneResponse(Long id, String title, CapstoneStatus status, int year) {
        this.id = id;
        this.title = title;
        this.status = status;
        this.year = year;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public CapstoneStatus getStatus() {
        return status;
    }

    public int getYear() {
        return year;
    }
}
