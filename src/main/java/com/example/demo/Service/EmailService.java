package com.example.demo.Service;

import com.example.demo.DTO.MailDTO;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender javaMail;

    public EmailService(JavaMailSender javaMailSender){
        javaMail = javaMailSender;
    }

    public void sendSimpleMessage(MailDTO mailDTO){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(mailDTO.to());
        message.setSubject(mailDTO.subject());
        message.setText(mailDTO.text());

        javaMail.send(message);
    }
}
