package com.example.hirewave.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME_NAME = "BearerAuth";

    @Bean
    public OpenAPI hireWaveOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("HireWave REST API")
                        .description("API hệ thống tuyển dụng HireWave: user, company, job, apply, AI matching, ...")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("HireWave Team")
                                .email("contact@hirewave.local")
                                .url("https://hirewave.local"))
                        .license(new License()
                                .name("Private")
                                .url("https://hirewave.local/license")))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME,
                                new SecurityScheme()
                                        .name(SECURITY_SCHEME_NAME)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")));
    }

    @Bean
    public GroupedOpenApi authAndUserApi() {
        return GroupedOpenApi.builder()
                .group("Auth & User")
                .pathsToMatch(
                        "/auth/**",
                        "/users/**"
                )
                .build();
    }

    @Bean
    public GroupedOpenApi companyAndJobApi() {
        return GroupedOpenApi.builder()
                .group("Company & Job")
                .pathsToMatch(
                        "/companies/**",
                        "/jobs/**"
                )
                .build();
    }

    @Bean
    public GroupedOpenApi aiAndCareerApi() {
        return GroupedOpenApi.builder()
                .group("AI & Career")
                .pathsToMatch(
                        "/ai/**",
                        "/career/**",
                        "/vnjobs/**"
                )
                .build();
    }

    @Bean
    public GroupedOpenApi resumeAndNotificationApi() {
        return GroupedOpenApi.builder()
                .group("Resume & Notification")
                .pathsToMatch(
                        "/resumes/**",
                        "/notifications/**"
                )
                .build();
    }
}

