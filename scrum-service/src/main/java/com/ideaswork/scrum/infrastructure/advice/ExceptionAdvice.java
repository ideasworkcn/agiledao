package com.ideaswork.scrum.infrastructure.advice;

import org.hibernate.AnnotationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

@ControllerAdvice
public class ExceptionAdvice {

    @ExceptionHandler(Exception.class)
    @ResponseBody
    public ResponseEntity handleException(Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }

    @ExceptionHandler(AnnotationException.class)
    @ResponseBody
    public ResponseEntity handleAnnotationException(Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }

}

