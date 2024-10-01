package com.example.demo.REQUEST_AND_RESPONSE;

import com.example.demo.DTO.KoiFishModel;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.Lob;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ResReqKoi {
    private String koiName;
    private Integer age;
    private Double length;
    private Double weight;
    private String sex;
    private String variety;
    private String origin;
    private BigDecimal price;
    private Integer pondId;
    private int userId;
    private String breeder;
    private String physique;
    private LocalDate inPondSince;
    @Lob
    private MultipartFile image;
    private int statusCode;
    private String error;
    private String message;
    private KoiFishModel koi;
    private List<KoiFishModel> koiList;

    public Integer getPondId() {
        return pondId;
    }

    public void setPondId(Integer pondId) {
        this.pondId = pondId;
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

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }





    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public KoiFishModel getKoi() {
        return koi;
    }

    public void setKoi(KoiFishModel koi) {
        this.koi = koi;
    }

    public List<KoiFishModel> getKoiList() {
        return koiList;
    }

    public void setKoiList(List<KoiFishModel> koiList) {
        this.koiList = koiList;
    }

    public String getPhysique() {
        return physique;
    }

    public void setPhysique(String physique) {
        this.physique = physique;
    }

    public String getBreeder() {
        return breeder;
    }

    public void setBreeder(String breeder) {
        this.breeder = breeder;
    }

    public LocalDate getInPondSince() {
        return inPondSince;
    }

    public void setInPondSince(LocalDate inPondSince) {
        this.inPondSince = inPondSince;
    }

    public MultipartFile getImage() {
        return image;
    }

    public void setImage(MultipartFile image) {
        this.image = image;
    }

    public ResReqKoi(String breeder, String koiName, Integer age, Double length, Double weight, String sex, String variety, String origin, BigDecimal price, Integer pondId, int userId, String physique, LocalDate inPondSince, MultipartFile image, int statusCode, String error, String message, KoiFishModel koi, List<KoiFishModel> koiList) {
        this.breeder = breeder;
        this.koiName = koiName;
        this.age = age;
        this.length = length;
        this.weight = weight;
        this.sex = sex;
        this.variety = variety;
        this.origin = origin;
        this.price = price;
        this.pondId = pondId;
        this.userId = userId;
        this.physique = physique;
        this.inPondSince = inPondSince;
        this.image = image;
        this.statusCode = statusCode;
        this.error = error;
        this.message = message;
        this.koi = koi;
        this.koiList = koiList;
    }

    public ResReqKoi() {
    }
}
