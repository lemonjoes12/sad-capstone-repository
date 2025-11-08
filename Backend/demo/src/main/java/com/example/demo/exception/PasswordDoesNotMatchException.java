package com.example.demo.exception;

public class PasswordDoesNotMatchException extends RuntimeException {
    public PasswordDoesNotMatchException() {
        super("Old password does not match");
    }
}
