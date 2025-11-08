package com.example.demo.exception;

public class PasswordConfirmationMismatchException extends RuntimeException {
    public PasswordConfirmationMismatchException() {
        super("New password and confirmation do not match");
    }
}
