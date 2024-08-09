package com.ideaswork.scrum.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.ParameterType;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

import java.util.Collections;

@Configuration
public class Swagger2Config {
    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.ideaswork.scrum"))
                .paths(PathSelectors.any())
                .build()
                .apiInfo(ApiInfo.DEFAULT)
                .globalRequestParameters(Collections.singletonList(
                        new springfox.documentation.builders.RequestParameterBuilder()
                                .name("Authorization")
                                .description("Authentication Token")
                                .in(ParameterType.HEADER)
                                .required(false)

                                .build()));
    }
}

