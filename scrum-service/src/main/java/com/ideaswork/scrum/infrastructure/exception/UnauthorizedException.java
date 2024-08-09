package com.ideaswork.scrum.infrastructure.exception;

public class UnauthorizedException extends RuntimeException{
    public UnauthorizedException(String message) {
        super(message);
    }
}
