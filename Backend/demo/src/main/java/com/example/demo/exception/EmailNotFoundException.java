package com.example.demo.exception;

public class EmailNotFoundException extends RuntimeException {
    public EmailNotFoundException(String message) {
        super("email with " + message + " not found");
    }
}
