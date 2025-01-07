package com.ideaswork.scrum.presentation;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
public class StaticController {

    @GetMapping("/")
    public String serveStaticResource(HttpServletRequest request) {
        return "index.html";
    }
}
