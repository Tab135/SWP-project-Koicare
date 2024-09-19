package com.example.demo.DTO;

import lombok.Builder;

@Builder
public record MailDTO(String to, String subject, String text) {

}
