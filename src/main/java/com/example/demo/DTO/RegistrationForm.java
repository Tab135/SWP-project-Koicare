package com.example.demo.DTO;

import com.example.demo.DTO.UserModel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "registration_forms")
public class RegistrationForm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "form_id")
    private Long formId;

    @OneToOne
    private UserModel user;

    @Column(name = "shop_name", nullable = false, length = 100)
    private String shopName;

    @Column(name = "address")
    private String address;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "tax_id", length = 50)
    private String taxId;

    @Column(name = "additional_info")
    private String additionalInfo;

    @Column(name = "status", length = 20)
    private String status = "pending";

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
}