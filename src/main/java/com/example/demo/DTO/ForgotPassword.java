package com.example.demo.DTO;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ForgotPassword {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int FPid;
    @Column(nullable = false)
    private int otp;
    @Column(nullable = false)
    private Date expirationTime;
    @Column(nullable = false)
    private int verified;
    @OneToOne
    private  UserModel user;


}
