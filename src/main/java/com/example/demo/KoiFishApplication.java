package com.example.demo;


import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication
@OpenAPIDefinition(info = @Info(title = "API"))
public class KoiFishApplication {

	public static void main(String[] args) {
		SpringApplication.run(KoiFishApplication.class, args);
	}

}
