package com.example.demo.exception;

public class InvalidCodeException extends RuntimeException {
    public InvalidCodeException() {
        super("Invalid Code");
    }
}
