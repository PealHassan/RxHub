package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.entity.mailEntity;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/mails")
public class EmailSenderService {
    @Autowired
    private JavaMailSender mailSender;

    @PostMapping("/sendEmail")
    public void sendEmail(@RequestBody mailEntity mailData) {
        String toEmail = mailData.getToEmail();
        String body = mailData.getBody();
        String subject = mailData.getSubject();
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("rxhub236@gmail.com");
        message.setTo(toEmail);
        message.setText(body);
        message.setSubject(subject);
        mailSender.send(message);
        System.out.println("Sending email to: " + toEmail);
    }
}
