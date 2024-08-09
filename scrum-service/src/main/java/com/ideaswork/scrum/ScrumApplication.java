package com.ideaswork.scrum;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ScrumApplication {

    public static void main(String[] args){
        // Load .env file
//        Dotenv dotenv = Dotenv.configure().load();
//
//        // Apply environment variables to system properties
//        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

        SpringApplication.run(ScrumApplication.class, args);
    }

}
