package com.example.demo.exception;

public class EmailAlreadyExistException extends RuntimeException {
    public EmailAlreadyExistException(String message) {
        super("Email with " + message+ " is already Exist");
    }
}
