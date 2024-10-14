package com.example.demo.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "Koi_fish")
@Data
public class KoiFishModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="Koi_fish_Id")
    private int koiId;
    @Column(name = "name")
    private String koiName;
    private Integer age;
    private Double length;
    private Double weight;
    private String sex;
    private String variety;
    private String origin;
    private BigDecimal price;
    @ManyToOne
    @JoinColumn(name ="pond_id")
    private PondModel pondId;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserModel userId;
    @Column(name = "In_pond_since")
    private LocalDate inPondSince;
    private String breeder;
    private String physique;
    @Lob
    @Column(name = "image", columnDefinition = "VARBINARY(MAX)")
    private byte[] image;

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public int getKoiId() {
        return koiId;
    }

    public void setKoiId(int koiId) {
        this.koiId = koiId;
    }

    public String getKoiName() {
        return koiName;
    }

    public void setKoiName(String koiName) {
        this.koiName = koiName;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Double getLength() {
        return length;
    }

    public void setLength(Double length) {
        this.length = length;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public String getVariety() {
        return variety;
    }

    public void setVariety(String variety) {
        this.variety = variety;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public PondModel getPondId() {
        return pondId;
    }

    public void setPondId(PondModel pondId) {
        this.pondId = pondId;
    }



    public LocalDate getInPondSince() {
        return inPondSince;
    }

    public void setInPondSince(LocalDate inPondSince) {
        this.inPondSince = inPondSince;
    }

    public String getBreeder() {
        return breeder;
    }

    public void setBreeder(String breeder) {
        this.breeder = breeder;
    }

    public String getPhysique() {
        return physique;
    }

    public void setPhysique(String physique) {
        this.physique = physique;
    }



    public UserModel getUserId() {
        return userId;
    }

    public void setUserId(UserModel userId) {
        this.userId = userId;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public KoiFishModel(UserModel userId, int koiId, String koiName, Integer age, Double length, Double weight, String sex, String variety, String origin, BigDecimal price, PondModel pondId, LocalDate inPondSince, String breeder, String physique, byte[] image) {
        this.userId = userId;
        this.koiId = koiId;
        this.koiName = koiName;
        this.age = age;
        this.length = length;
        this.weight = weight;
        this.sex = sex;
        this.variety = variety;
        this.origin = origin;
        this.price = price;
        this.pondId = pondId;
        this.inPondSince = inPondSince;
        this.breeder = breeder;
        this.physique = physique;
        this.image = image;
    }

    public KoiFishModel() {
    }
}
